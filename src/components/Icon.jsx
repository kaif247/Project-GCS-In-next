import React from 'react';
import Icons from './icons'; // correct relative path

function resolveIcon(name) {
  if (!name && name !== 0) return undefined;
  // prefer explicit map lookup, fall back to helper if provided
  if (Icons[name]) return Icons[name];
  if (typeof Icons.getIcon === 'function') return Icons.getIcon(name);
  // try normalized keys
  const k = String(name).trim().toLowerCase().replace(/\.svg$/i, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return Icons[k] || Icons[k.replace(/-/g, '')];
}

export default function Icon({ name, size, className = '', circle = false, active = false, onClick, style = {}, ...props }) {
  const Comp = resolveIcon(name);
  if (!Comp) return null;
  const px = typeof size === 'number' ? `${size}px` : size || undefined;
  const classes = ['app-icon', className, circle ? 'app-icon--circle' : '', active ? 'app-icon--active' : ''].filter(Boolean).join(' ');
  const svgStyle = { width: px, height: px, ...style };
  const isUrl = typeof Comp === 'string' || (Comp && typeof Comp === 'object' && typeof Comp.src === 'string');
  const src = isUrl ? (typeof Comp === 'string' ? Comp : Comp.src) : null;

  return (
    <span className={classes} onClick={onClick} {...props}>
      {isUrl ? (
        <img src={src} alt="" aria-hidden="true" style={svgStyle} />
      ) : (
        <Comp style={svgStyle} />
      )}
    </span>
  );
}
