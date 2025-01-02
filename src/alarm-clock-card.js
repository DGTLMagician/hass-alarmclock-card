import { html, css, LitElement } from 'lit';
import { createComponent } from '@lit-labs/react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import AlarmClockCard from './AlarmClockCard';

class AlarmClockCardElement extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object },
    };
  }

  static styles = css`
    :host {
      display: block;
    }
  `;

  constructor() {
    super();
    this._root = null;
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error('Please define an entity');
    }
    this.config = config;
  }

  connectedCallback() {
    super.connectedCallback();
    this._initializeCard();
  }

  _initializeCard() {
    if (!this.shadowRoot) return;
    
    const mountPoint = document.createElement('div');
    this.shadowRoot.appendChild(mountPoint);
    
    this._root = createRoot(mountPoint);
    this._updateCard();
  }

  _updateCard() {
    if (!this._root || !this.hass || !this.config) return;
    
    this._root.render(
      <AlarmClockCard
        hass={this.hass}
        config={this.config}
      />
    );
  }

  updated(changedProps) {
    super.updated(changedProps);
    this._updateCard();
  }

  getCardSize() {
    return 3;
  }

  render() {
    return html`<div></div>`;
  }
}

customElements.define('alarm-clock-card', AlarmClockCardElement);