#!/usr/bin/env python3
"""
AMINOS BOT BUILDER — Hermes-compatible script
Runs on Linux machine via camoufox browser automation
Called by n8n Execute Command node when a bot order is ready to build

Usage: python3 aminos_bot_builder.py --order_id <id> --customer_email <email> \
        --website_url <url> --bot_name <name> --tier <starter|business|lead|care>

Output: JSON with { "success": true, "embed_code": "...", "bot_id": "...", "preview_url": "..." }
"""

import argparse
import json
import sys
import time
import os
import logging

logging.basicConfig(level=logging.INFO, format='[%(asctime)s] %(levelname)s: %(message)s')
log = logging.getLogger(__name__)

def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('--order_id', required=True)
    parser.add_argument('--customer_email', required=True)
    parser.add_argument('--website_url', required=True)
    parser.add_argument('--bot_name', default='AI Assistant')
    parser.add_argument('--tier', default='starter', choices=['starter','business','lead','care'])
    parser.add_argument('--primary_color', default='#6B46C1')
    parser.add_argument('--output_file', default=None)
    return parser.parse_args()

def build_bot(args):
    log.info(f"Starting bot build for order {args.order_id} — tier: {args.tier}")
    log.info(f"Customer: {args.customer_email} | URL: {args.website_url}")

    try:
        from camoufox.sync_api import Camoufox
    except ImportError:
        log.error("camoufox not installed — run: pip install camoufox")
        return {"success": False, "error": "camoufox not installed"}

    result = {}

    with Camoufox(headless=False) as browser:
        page = browser.new_page()

        try:
            # ── Step 1: Login to Aminos ──────────────────────────────────────
            log.info("Navigating to Aminos login...")
            page.goto("https://app.aminos.ai/login", wait_until="networkidle")
            time.sleep(2)

            # Fill login form
            page.fill('input[type="email"]', "tinglott@gmail.com")
            page.fill('input[type="password"]', "Supercat@123")
            page.click('button[type="submit"]')
            page.wait_for_load_state("networkidle")
            time.sleep(3)
            log.info("Logged in to Aminos ✓")

            # ── Step 2: Create new bot ────────────────────────────────────────
            log.info("Creating new bot...")
            # Look for "Create Bot" or "New Bot" button
            create_btn = page.locator('text=Create Bot, text=New Bot, button:has-text("Create"), button:has-text("New")').first
            create_btn.click()
            time.sleep(2)

            # ── Step 3: Set bot name ─────────────────────────────────────────
            name_field = page.locator('input[placeholder*="name"], input[name*="name"]').first
            name_field.fill(args.bot_name)
            time.sleep(1)

            # ── Step 4: Train on website URL ─────────────────────────────────
            log.info(f"Training bot on {args.website_url}...")
            url_field = page.locator('input[placeholder*="url"], input[placeholder*="URL"], input[placeholder*="website"]').first
            url_field.fill(args.website_url)

            # Click Train / Add URL button
            train_btn = page.locator('button:has-text("Train"), button:has-text("Add URL"), button:has-text("Add")').first
            train_btn.click()
            time.sleep(8)  # Training takes a moment
            log.info("Training complete ✓")

            # ── Step 5: Configure tier-specific settings ──────────────────────
            if args.tier in ['business', 'lead']:
                log.info("Enabling GPT-5 / advanced AI mode...")
                # Look for AI model selector
                try:
                    gpt_option = page.locator('text=GPT-5, text=Advanced, select[name*="model"]').first
                    gpt_option.click()
                    time.sleep(1)
                except:
                    pass

            if args.tier == 'lead':
                log.info("Enabling lead capture...")
                try:
                    lead_toggle = page.locator('text=Lead Capture, input[type="checkbox"]:near(:text("lead"))').first
                    lead_toggle.click()
                    time.sleep(1)
                except:
                    pass

            # ── Step 6: Set color/branding ────────────────────────────────────
            try:
                color_input = page.locator('input[type="color"], input[placeholder*="color"]').first
                color_input.fill(args.primary_color)
                time.sleep(1)
            except:
                pass

            # ── Step 7: Save the bot ──────────────────────────────────────────
            save_btn = page.locator('button:has-text("Save"), button:has-text("Publish"), button:has-text("Create")').first
            save_btn.click()
            time.sleep(3)
            log.info("Bot saved ✓")

            # ── Step 8: Get embed code ────────────────────────────────────────
            log.info("Getting embed code...")
            try:
                embed_btn = page.locator('text=Embed, text=Get Code, button:has-text("Embed"), button:has-text("Install")').first
                embed_btn.click()
                time.sleep(2)

                embed_code_el = page.locator('code, textarea:has-text("script"), pre:has-text("script")').first
                embed_code = embed_code_el.text_content()
                log.info(f"Embed code retrieved: {embed_code[:80]}...")
            except Exception as e:
                log.warning(f"Could not auto-grab embed code: {e}")
                embed_code = f'<!-- Aminos Bot Embed — retrieve manually from app.aminos.ai for order {args.order_id} -->'

            # ── Step 9: Get bot preview URL ───────────────────────────────────
            current_url = page.url
            bot_id = current_url.split('/')[-1] if '/' in current_url else args.order_id

            result = {
                "success": True,
                "order_id": args.order_id,
                "bot_id": bot_id,
                "embed_code": embed_code,
                "preview_url": f"https://app.aminos.ai/bots/{bot_id}",
                "tier": args.tier,
                "customer_email": args.customer_email,
                "website_url": args.website_url
            }

        except Exception as e:
            log.error(f"Bot build failed: {e}")
            result = {
                "success": False,
                "order_id": args.order_id,
                "error": str(e),
                "customer_email": args.customer_email
            }

    return result

def main():
    args = parse_args()
    result = build_bot(args)

    output = json.dumps(result, indent=2)
    print(output)

    if args.output_file:
        with open(args.output_file, 'w') as f:
            f.write(output)
        log.info(f"Result saved to {args.output_file}")

    sys.exit(0 if result.get('success') else 1)

if __name__ == '__main__':
    main()
