# Professional Portfolio Website

A modern, responsive portfolio website showcasing professional experience and skills. Built with HTML5, CSS3, and JavaScript with a focus on performance and accessibility.

## Features

- 📱 Fully responsive design optimized for all devices
- 🌓 Dark/Light theme with system preference detection
- ⚡ Performance optimized with lazy loading
- ♿ WCAG 2.1 compliant accessibility features
- 📊 Interactive skill bars and project filtering
- 🖨️ Print-friendly CSS for resume printing
- 🔍 SEO optimized with meta tags
- 📈 GitHub activity integration

## Tech Stack

- HTML5 for semantic markup
- CSS3 with modern features (CSS Grid, Flexbox, CSS Variables)
- Vanilla JavaScript for interactivity
- Bootstrap 5 for responsive grid system
- Font Awesome for icons
- Sienna Widget Integration

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cv-website.git
   ```

2. Navigate to the project directory:
   ```bash
   cd cv-website
   ```

3. Open `index.html` in your browser or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   ```

## Project Structure

```
cv-website/
├── css/
│   ├── style.css          # Main styles
│   ├── components.css     # Component-specific styles
│   ├── projects.css       # Project section styles
│   └── print.css         # Print-specific styles
├── js/
│   ├── main.js           # Main JavaScript
│   └── script.js         # Additional functionality
├── images/               # Image assets
├── index.html           # Main HTML file
├── 404.html            # Error page
└── README.md           # Documentation
```

## Customization

### Themes
Modify theme colors in `css/style.css`:
```css
:root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    /* ... other variables ... */
}
```

### Content
Update your information in `index.html`:
- Personal details in the header section
- Experience in the timeline section
- Skills and their percentages
- Projects and portfolio items

## Deployment

1. Push to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. Enable GitHub Pages:
   - Go to repository Settings
   - Navigate to Pages section
   - Select main branch
   - Save changes

Your site will be live at `https://yourusername.github.io/cv-website/`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Font Awesome for icons
- Bootstrap team
- Sienna Widget developers