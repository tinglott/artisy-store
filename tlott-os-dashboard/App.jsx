import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SalesDashboard from './components/SalesDashboard';
import ContentCalendar from './components/ContentCalendar';
import YouTubeAnalytics from './components/YouTubeAnalytics';
import ProductManager from './components/ProductManager';
import TaskTracker from './components/TaskTracker';
import WellnessGoals from './components/WellnessGoals';
import PageVoltMonitor from './components/PageVoltMonitor';
import { PayhipVoltMonitor } from './components/PayhipVoltMonitor';
import GiftForgeMonitor from './components/GiftForgeMonitor';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [productsData, setProductsData] = useState([]);
  const [publishLog, setPublishLog] = useState([]);

  useEffect(() => {
    // Load product data
    const loadData = async () => {
      try {
        const productsResponse = await fetch('/AD_ROTATION_2026_APPS.json');
        const products = await productsResponse.json();
        setProductsData(products.apps || []);

        const publishResponse = await fetch('/dual_publish_log.json');
        const publish = await publishResponse.json();
        setPublishLog(publish || []);
      } catch (error) {
        console.log('Using mock data - API integration ready');
      }
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-base-900" data-theme="dark">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="tabs tabs-bordered mb-8 flex flex-wrap">
          <button
            onClick={() => setActiveTab('overview')}
            className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            className={`tab ${activeTab === 'sales' ? 'tab-active' : ''}`}
          >
            💰 Sales
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`tab ${activeTab === 'content' ? 'tab-active' : ''}`}
          >
            📱 Content
          </button>
          <button
            onClick={() => setActiveTab('youtube')}
            className={`tab ${activeTab === 'youtube' ? 'tab-active' : ''}`}
          >
            ▶️ YouTube
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`tab ${activeTab === 'products' ? 'tab-active' : ''}`}
          >
            📦 Products
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`tab ${activeTab === 'tasks' ? 'tab-active' : ''}`}
          >
            ✓ Tasks
          </button>
          <button
            onClick={() => setActiveTab('wellness')}
            className={`tab ${activeTab === 'wellness' ? 'tab-active' : ''}`}
          >
            💚 Wellness
          </button>
          <button
            onClick={() => setActiveTab('pagevolt')}
            className={`tab ${activeTab === 'pagevolt' ? 'tab-active' : ''}`}
          >
            ⚡ PageVolt
          </button>
          <button
            onClick={() => setActiveTab('payhipvolt')}
            className={`tab ${activeTab === 'payhipvolt' ? 'tab-active' : ''}`}
          >
            ⚡ PayhipVolt
          </button>
          <button
            onClick={() => setActiveTab('giftforge')}
            className={`tab ${activeTab === 'giftforge' ? 'tab-active' : ''}`}
          >
            🎁 GiftForge
          </button>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {(activeTab === 'overview') && (
            <>
              <SalesDashboard />
              <ContentCalendar />
              <YouTubeAnalytics />
              <WellnessGoals />
            </>
          )}

          {activeTab === 'sales' && <SalesDashboard />}
          {activeTab === 'content' && <ContentCalendar />}
          {activeTab === 'youtube' && <YouTubeAnalytics />}
          {activeTab === 'products' && <ProductManager products={productsData} />}
          {activeTab === 'tasks' && <TaskTracker />}
          {activeTab === 'wellness' && <WellnessGoals />}
          {activeTab === 'pagevolt' && <PageVoltMonitor />}
          {activeTab === 'payhipvolt' && <PayhipVoltMonitor />}
          {activeTab === 'giftforge' && <GiftForgeMonitor />}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer footer-center bg-base-800 text-base-content p-4 mt-12">
        <div>
          <p>T.Lott OS Dashboard • Personal Operating System</p>
          <p className="text-xs opacity-70">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
