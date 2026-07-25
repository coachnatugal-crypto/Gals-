# Assets GAL'S Studio

Subí aquí logos, fotos, videos y creativos. Next.js sirve todo desde `/public` con rutas como `/brand/logos/logo.svg`.

## Estructura

```
public/
├── brand/
│   ├── logos/          → Logo principal, versión oscura, favicon, wordmark
│   └── icons/          → Íconos de marca, app icon, social
├── media/
│   ├── hero/           → Foto/video del hero (polaroid principal)
│   ├── capsules/       → Fondos de las cápsulas creativas (programas)
│   ├── coaches/        → Fotos de Nati Galvis, María Arango, Nati Ramos
│   ├── community/      → Fotos para polaroids / comunidad / testimonios
│   ├── studio/         → Estudio, espacio, props, ambiente
│   └── video/          → Clases en movimiento, reels, loops del hero
└── creatives/
    ├── stickers/       → Stickers, sellos, estrellas, overlays
    ├── patterns/       → Texturas / patrones de fondo
    └── misc/           → Otros creativos sueltos
```

## Nombres sugeridos (para enchufarlos rápido)

| Archivo | Uso |
|---|---|
| `brand/logos/logo-light.png` | Logo sobre fondos oscuros |
| `brand/logos/logo-dark.png` | Logo sobre fondos claros |
| `brand/logos/logo.svg` | Vector preferido |
| `brand/logos/favicon.ico` | Favicon |
| `media/hero/hero-main.jpg` | Imagen principal del polaroid |
| `media/hero/hero-loop.mp4` | Video loop del hero (opcional) |
| `media/capsules/club.jpg` | Cápsula GAL'S Club |
| `media/capsules/pilates.jpg` | Cápsula Pilates + Sculpt |
| `media/capsules/experiencias.jpg` | Cápsula Experiencias |
| `media/capsules/yoga.jpg` | Cápsula Yin + Vinyasa |
| `media/capsules/week.jpg` | Cápsula Experience Week |
| `media/coaches/nati-galvis.jpg` | |
| `media/coaches/maria-arango.jpg` | |
| `media/coaches/nati-ramos.jpg` | |
| `media/community/polaroid-01.jpg` | Stack comunidad |
| `media/community/polaroid-02.jpg` | |
| `media/community/polaroid-03.jpg` | |
| `media/video/clase-01.mp4` | |

## Formatos recomendados

- **Logos:** PNG transparente o SVG  
- **Fotos:** JPG/WebP, ideal 1600–2400px de ancho  
- **Video:** MP4 (H.264), corto y liviano para web (< 15–20 MB si es hero)  
- **Stickers:** PNG transparente  

## Nota

Los archivos `.gitkeep` solo mantienen las carpetas en git. Podés borrarlos cuando ya haya archivos reales adentro.
