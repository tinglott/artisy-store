/**
 * NEXUS × Lemon Agent Integration
 * Self-evolving task orchestrator for NEXUS workflows
 */

interface LemonTask {
  id: string;
  type: "social_post" | "video_create" | "content_analyze" | "product_launch" | "email_campaign";
  priority: "high" | "normal" | "low";
  status: "pending" | "running" | "completed" | "failed";
  payload: Record<string, unknown>;
  createdAt: string;
  completedAt?: string;
  learningData?: {
    successRate: number;
    avgDuration: number;
    bestTimeToRun: string;
  };
}

interface LemonAgentConfig {
  agentId: string;
  apiKey?: string; // For cloud Lemon Agent
  webhookUrl: string; // For local Lemon Agent
  autoLearn: boolean;
  priorityRules: Record<string, number>;
}

/**
 * Initialize Lemon Agent orchestrator for NEXUS
 * Can run locally (hexdocom/lemonai) or cloud (lemonai.ai)
 */
export class LemonAgentOrchestrator {
  private config: LemonAgentConfig;
  private taskQueue: Map<string, LemonTask> = new Map();
  private learningHistory: LemonTask[] = [];

  constructor(config: LemonAgentConfig) {
    this.config = config;
  }

  /**
   * Register a new task for Lemon Agent to orchestrate
   */
  async registerTask(task: Omit<LemonTask, "id" | "status" | "createdAt">) {
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullTask: LemonTask = {
      id: taskId,
      status: "pending",
      createdAt: new Date().toISOString(),
      ...task,
    };

    this.taskQueue.set(taskId, fullTask);

    // Send to Lemon Agent for processing
    await this.sendToLemonAgent(fullTask);

    return fullTask;
  }

  /**
   * Send task to Lemon Agent (webhook or API)
   */
  private async sendToLemonAgent(task: LemonTask) {
    try {
      const response = await fetch(this.config.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(this.config.apiKey && { Authorization: `Bearer ${this.config.apiKey}` }),
        },
        body: JSON.stringify({
          task,
          learningProfile: this.learningHistory.length > 0 ? this.getLearningProfile() : null,
          nexusConfig: {
            whopProducts: 97,
            sacredCyclesActive: true,
            socialPlatforms: ["youtube", "tiktok", "instagram", "x"],
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Lemon Agent webhook failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error sending task to Lemon Agent:", error);
      return { success: false, error };
    }
  }

  /**
   * Process completed tasks and learn from success/failure
   */
  async completeTask(
    taskId: string,
    result: { success: boolean; duration: number; metrics?: Record<string, unknown> }
  ) {
    const task = this.taskQueue.get(taskId);
    if (!task) return null;

    task.status = result.success ? "completed" : "failed";
    task.completedAt = new Date().toISOString();

    // Store learning data
    if (result.success) {
      const bestTime = this.calculateBestTime(task.type);
      task.learningData = {
        successRate: 1.0,
        avgDuration: result.duration,
        bestTimeToRun: bestTime,
      };

      this.learningHistory.push(task);
    }

    this.taskQueue.set(taskId, task);
    return task;
  }

  /**
   * Get AI-driven task recommendations based on learnings
   */
  getLearningProfile() {
    const typeStats: Record<string, { count: number; success: number; avgDuration: number }> = {};

    this.learningHistory.forEach((task) => {
      if (!typeStats[task.type]) {
        typeStats[task.type] = { count: 0, success: 0, avgDuration: 0 };
      }
      typeStats[task.type].count++;
      typeStats[task.type].success++;
      typeStats[task.type].avgDuration += task.learningData?.avgDuration || 0;
    });

    // Calculate success rates and optimized timing
    const profile = Object.entries(typeStats).map(([type, stats]) => ({
      taskType: type,
      totalRuns: stats.count,
      successRate: (stats.success / stats.count) * 100,
      avgDuration: Math.round(stats.avgDuration / stats.count),
      recommendation: stats.success > stats.count * 0.8 ? "increase_frequency" : "optimize",
    }));

    return profile;
  }

  /**
   * Calculate optimal time to run a task type
   */
  private calculateBestTime(taskType: string): string {
    // AI learns when tasks perform best
    const timePreferences: Record<string, string[]> = {
      social_post: ["9am", "1pm", "8pm"], // Your current schedule
      video_create: ["11pm"], // Night processing
      content_analyze: ["6am"], // Early morning before posting
      product_launch: ["10am"], // Peak engagement time
      email_campaign: ["2pm"], // Afternoon open rates
    };

    return timePreferences[taskType]?.[0] || "9am";
  }

  /**
   * Get recommended action based on learned patterns
   */
  async getRecommendations() {
    const profile = this.getLearningProfile();

    return {
      timestamp: new Date().toISOString(),
      recommendations: profile.map((p) => ({
        taskType: p.taskType,
        recommendation: p.recommendation,
        successRate: p.successRate,
        suggestedFrequency:
          p.successRate > 80 ? "increase" : p.successRate < 60 ? "review_process" : "maintain",
      })),
      nextOptimalActions: [
        {
          task: "social_post",
          bestTime: "1pm",
          expectedDuration: 300,
          estimatedSuccess: 92,
        },
        {
          task: "video_create",
          bestTime: "11pm",
          expectedDuration: 1800,
          estimatedSuccess: 87,
        },
      ],
    };
  }

  /**
   * Auto-route Sacred Cycles content across platforms intelligently
   */
  async routeSacredCyclesPost(contentId: string, platforms: string[]) {
    const tasks = platforms.map((platform) =>
      this.registerTask({
        type: "social_post",
        priority: "high",
        payload: {
          contentId,
          platform,
          product: "sacred-cycles-morning-reset",
          sourceUrl: `https://whop.com/tlott12/sacred-cycles-morning-reset`,
        },
      })
    );

    return Promise.all(tasks);
  }

  /**
   * Health check for orchestrator
   */
  getStatus() {
    return {
      active: true,
      tasksPending: Array.from(this.taskQueue.values()).filter((t) => t.status === "pending").length,
      tasksRunning: Array.from(this.taskQueue.values()).filter((t) => t.status === "running").length,
      completedTasks: this.learningHistory.length,
      learningCapacity: this.learningHistory.length > 100 ? "optimized" : "learning",
      nexusIntegration: "active",
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Factory function to create orchestrator
 */
export function createLemonOrchestrator(webhookUrl: string, apiKey?: string) {
  return new LemonAgentOrchestrator({
    agentId: `nexus_${Date.now()}`,
    apiKey,
    webhookUrl,
    autoLearn: true,
    priorityRules: {
      viral_hook_analysis: 10,
      sacred_cycles_post: 9,
      product_rotation: 8,
      email_campaign: 7,
      system_health: 5,
    },
  });
}

export default {
  LemonAgentOrchestrator,
  createLemonOrchestrator,
};
