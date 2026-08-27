// ─── FFF Food Icons ───
import { asset } from '../utils/assetPath'

function IconImg({ file, alt, size }) {
  return (
    <img
      src={asset(file)}
      alt={alt}
      width={size}
      height={size}
      style={{ objectFit: 'cover', display: 'block' }}
    />
  )
}

export function IconFeldkueche({ size = 48 }) {
  return <IconImg file="Icon Feldkueche.png" alt="Feldküche" size={size} />
}

export function IconFestivalbar({ size = 48 }) {
  return <IconImg file="Icon Festivalbar.png" alt="Festivalbar" size={size} />
}

export function IconZanzibar({ size = 48 }) {
  return <IconImg file="Icon Zanzibar.png" alt="Zanzibar" size={size} />
}

export function IconWahrsagerzelt({ size = 48 }) {
  return <IconImg file="Icon Wahrsagerzelt.png" alt="Zauberzelt" size={size} />
}

export function IconMerch({ size = 48 }) {
  return <IconImg file="Icon Merch.png" alt="Merch" size={size} />
}
