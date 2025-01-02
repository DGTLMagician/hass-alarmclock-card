((LitElement, html, css) => {
  const CARD_VERSION = '1.0.1';
  
  class AlarmClockCard extends LitElement {
    static get properties() {
      return {
        hass: {},
        config: {}
      };
    }

    static get styles() {
      return css`
        .alarm-card {
          padding: 16px;
          background: var(--ha-card-background, var(--card-background-color, white));
          border-radius: var(--ha-card-border-radius, 4px);
          box-shadow: var(--ha-card-box-shadow, 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2));
        }
        .flex {
          display: flex;
        }
        .justify-between {
          justify-content: space-between;
        }
        .items-center {
          align-items: center;
        }
        .mb-4 {
          margin-bottom: 16px;
        }
        .text-xl {
          font-size: 1.25rem;
          line-height: 1.75rem;
        }
        .font-semibold {
          font-weight: 600;
        }
        .status-badge {
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 500;
          color: white;
        }
        .status-triggered { background-color: var(--error-color, #db4437); }
        .status-snoozed { background-color: var(--warning-color, #ffa600); }
        .status-set { background-color: var(--success-color, #43a047); }
        .status-unset { background-color: var(--secondary-text-color, #727272); }
        .time-display {
          font-size: 2rem;
          font-weight: bold;
          color: var(--primary-text-color);
        }
        .countdown {
          color: var(--secondary-text-color);
          margin-top: 8px;
        }
        .button-row {
          display: flex;
          gap: 8px;
          margin-top: 16px;
        }
        button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          color: white;
          cursor: pointer;
          font-weight: 500;
        }
        .button-enable { background-color: var(--success-color, #43a047); }
        .button-disable { background-color: var(--error-color, #db4437); }
        .button-snooze { background-color: var(--warning-color, #ffa600); }
        .button-stop { background-color: var(--secondary-text-color, #727272); }
      `;
    }

    setConfig(config) {
      if (!config.entity) {
        throw new Error('Please define an entity');
      }
      this.config = config;
    }

    getStatusBadgeClass(status) {
      return `status-badge status-${status}`;
    }

    render() {
      if (!this.hass || !this.config) {
        return html``;
      }

      const entity = this.hass.states[this.config.entity];
      if (!entity) {
        return html`
          <ha-card>
            <div class="alarm-card">
              Entity ${this.config.entity} not found.
            </div>
          </ha-card>
        `;
      }

      const timeEntity = this.hass.states[this.config.entity.replace('switch.', 'datetime.')];
      const countdownEntity = this.hass.states[this.config.entity.replace('switch.', 'sensor.') + '_countdown'];
      const statusEntity = this.hass.states[this.config.entity.replace('switch.', 'sensor.') + '_status'];

      const isActive = entity.state === 'on';
      const status = statusEntity?.state || 'unset';
      const time = timeEntity?.state ? new Date(timeEntity.state).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '';
      const countdown = countdownEntity?.attributes?.formatted || '';

      return html`
        <ha-card>
          <div class="alarm-card">
            <div class="flex justify-between items-center mb-4">
              <div class="text-xl font-semibold">${entity.attributes.friendly_name}</div>
              <div class="${this.getStatusBadgeClass(status)}">
                ${status.charAt(0).toUpperCase() + status.slice(1)}
              </div>
            </div>
            
            <div class="time-display">${time}</div>
            
            ${isActive && countdown ? html`
              <div class="countdown">
                Time until alarm: ${countdown}
              </div>
            ` : ''}
            
            <div class="button-row">
              <button
                class="${isActive ? 'button-disable' : 'button-enable'}"
                @click=${() => this._toggleAlarm(entity)}
              >
                ${isActive ? 'Disable' : 'Enable'}
              </button>
              
              ${status === 'triggered' ? html`
                <button
                  class="button-snooze"
                  @click=${() => this._snoozeAlarm(entity)}
                >
                  Snooze
                </button>
                <button
                  class="button-stop"
                  @click=${() => this._stopAlarm(entity)}
                >
                  Stop
                </button>
              ` : ''}
            </div>
          </div>
        </ha-card>
      `;
    }

    _toggleAlarm(entity) {
      this.hass.callService('switch', entity.state === 'on' ? 'turn_off' : 'turn_on', {
        entity_id: entity.entity_id,
      });
    }

    _snoozeAlarm(entity) {
      this.hass.callService('alarm_clock', 'snooze', {
        entity_id: entity.entity_id,
      });
    }

    _stopAlarm(entity) {
      this.hass.callService('alarm_clock', 'stop', {
        entity_id: entity.entity_id,
      });
    }

    getCardSize() {
      return 3;
    }
  }

  customElements.define('alarm-clock-card', AlarmClockCard);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: 'alarm-clock-card',
    name: 'Alarm Clock Card',
    description: 'A beautiful alarm clock card for Home Assistant',
    preview: true,
    version: CARD_VERSION
  });

})(window.LitElement, window.lit.html, window.lit.css);