# Alarm Clock Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg?style=for-the-badge)](https://github.com/hacs/integration)
[![GitHub Release][releases-shield]][releases]
![Project Maintenance][maintenance-shield]
[![License][license-shield]](LICENSE)

A beautiful alarm clock card for Home Assistant

![Preview](preview.png)

## Features

- 🎨 Clean, modern design
- 🌙 24-hour time format
- ⏰ Live countdown timer
- 🔔 Easy alarm control
- 🌈 Status indicators
- 📱 Mobile-friendly

## Installation

### HACS (Recommended)

1. Open HACS
2. Go to "Frontend"
3. Click the menu dots in the top right
4. Select "Custom repositories"
5. Add `DGTLMagician/hass-alarmclock-card` with category "Lovelace"
6. Click Install
7. Add the card to your dashboard

### Manual Installation

1. Download the `alarm-clock-card.js` file from the latest release
2. Upload it to `/config/www/`
3. Add the resource in Home Assistant:
   ```yaml
   resources:
     - url: /local/alarm-clock-card.js
       type: module
   ```

## Usage

Add the card to your dashboard with the following configuration:

```yaml
type: custom:alarm-clock-card
entity: switch.your_alarm_clock
```

### Configuration Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| entity | string | yes | - | The switch entity ID of your alarm clock |

The card automatically finds related datetime and sensor entities based on the switch entity ID.

## Development

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm start
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you find this card helpful, consider starring the repository! ⭐

---

[releases-shield]: https://img.shields.io/github/release/DGTLMagician/hass-alarmclock-card.svg?style=for-the-badge
[releases]: https://github.com/DGTLMagician/hass-alarmclock-card/releases
[maintenance-shield]: https://img.shields.io/maintenance/yes/2025.svg?style=for-the-badge
[license-shield]: https://img.shields.io/github/license/DGTLMagician/hass-alarmclock-card.svg?style=for-the-badge
