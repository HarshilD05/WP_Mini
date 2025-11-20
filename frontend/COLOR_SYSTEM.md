# Color System Documentation

## Overview
The application uses a centralized CSS variable system defined in `src/colors.css` for easy theme management and consistent styling across all components.

## CSS Variables Reference

### Background Colors
- `--bg-primary`: Main background color (white in light, black in dark)
- `--bg-secondary`: Secondary background for cards/sections (#fafafa in light, #1a1a1a in dark)
- `--bg-tertiary`: Tertiary background for disabled states (#f5f5f5 in light, #2a2a2a in dark)

### Text Colors
- `--text-primary`: Main text color (#0a0a0a in light, #ffffff in dark)
- `--text-secondary`: Secondary text like descriptions (#666666 in light, #a0a0a0 in dark)
- `--text-tertiary`: Tertiary text for disabled/subtle elements (#999999 in light, #6b6b6b in dark)

### Border Colors
- `--border-primary`: Main borders (#e5e5e5 in light, #333333 in dark)
- `--border-secondary`: Secondary borders for inputs (#d4d4d4 in light, #404040 in dark)

### Accent Colors
- `--accent-primary`: Primary accent (#0a0a0a in light, #ffffff in dark)
- `--accent-hover`: Hover state for accents (#333333 in light, #e5e5e5 in dark)

### Status Colors (consistent across themes)
- `--status-pending`: Orange (#f59e0b) for pending items
- `--status-approved`: Green (#10b981) for approved items
- `--status-rejected`: Red (#ef4444) for rejected items
- `--status-info`: Blue (#3b82f6) for informational items

### Interactive States
- `--hover-bg`: Background on hover (#f5f5f5 in light, #2a2a2a in dark)
- `--active-bg`: Background for active/selected items (#e5e5e5 in light, #333333 in dark)
- `--focus-ring`: Focus outline color (rgba(10, 10, 10, 0.2) in light, rgba(255, 255, 255, 0.2) in dark)

### Overlays & Modals
- `--overlay-bg`: Backdrop overlay (rgba(0, 0, 0, 0.5) in light, rgba(0, 0, 0, 0.7) in dark)
- `--modal-bg`: Modal background (#ffffff in light, #1a1a1a in dark)

### Shadows
- `--shadow-sm`: Small shadow for subtle elevation
- `--shadow-md`: Medium shadow for cards
- `--shadow-lg`: Large shadow for dropdowns
- `--shadow-xl`: Extra large shadow for modals

## Usage

### In Component CSS Files
Instead of hardcoded colors:
```css
/* ❌ Don't do this */
.my-component {
  background-color: #ffffff;
  color: #0a0a0a;
  border: 1px solid #e5e5e5;
}
```

Use CSS variables:
```css
/* ✅ Do this */
.my-component {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
}
```

### Theme Switching
To enable dark theme, add the `data-theme="dark"` attribute to a parent element:

```javascript
// Toggle theme
document.documentElement.setAttribute('data-theme', 'dark');

// Remove dark theme (back to light)
document.documentElement.removeAttribute('data-theme');
```

### Benefits
1. **Easy theme changes**: Modify colors in one file (`colors.css`)
2. **Consistent styling**: All components use same color palette
3. **Dark mode ready**: Just toggle `data-theme` attribute
4. **Maintainable**: Update once, applies everywhere
5. **Scalable**: Add new color variables as needed

## Updated Components
All component CSS files have been updated to use CSS variables:

### Components
- ✅ Navbar.css
- ✅ Sidebar.css
- ✅ FormInput.css
- ✅ FormSelect.css
- ✅ FormTextArea.css
- ✅ DateTimePicker.css
- ✅ CreateUserModal.css

### Pages
- ✅ RequestForm.css
- ✅ AdminHome.css
- ✅ ManageUsers.css

All other pages will automatically inherit these variables once updated.

## Adding New Colors
To add a new color variable:

1. Open `src/colors.css`
2. Add the variable in both `:root` and `[data-theme="dark"]` sections:

```css
:root {
  /* existing variables... */
  --my-new-color: #123456;
}

[data-theme="dark"] {
  /* existing variables... */
  --my-new-color: #654321;
}
```

3. Use it in your component CSS:
```css
.my-element {
  background-color: var(--my-new-color);
}
```

## Future Enhancements
- Add theme toggle button in Navbar
- Persist theme preference in localStorage
- Add more theme variations (blue, green, etc.)
- Create theme context for React components
