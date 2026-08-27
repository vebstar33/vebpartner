import React, { useState } from 'react';

interface ProviderLogoPlateProps {
  src?: string;
  name: string;
  variant?: 'card' | 'detail';
}

const VARIANT_CLASSES = {
  card: {
    plate: 'inline-flex h-8 w-10 shrink-0 items-center justify-center rounded-lg bg-vp-surface-subtle border border-vp shadow-sm light:bg-white light:border-zinc-200',
    logoWrap: 'flex h-5 w-5 items-center justify-center rounded-[5px] bg-white ring-1 ring-black/5',
    logo: 'block h-4 w-4 object-contain',
    label: 'sr-only',
  },
  detail: {
    plate: 'inline-flex min-h-9 max-w-full items-center gap-2 rounded-lg bg-vp-surface-raised border border-vp px-2.5 py-1.5 shadow-sm light:bg-white light:border-zinc-200',
    logoWrap: 'flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white ring-1 ring-black/5',
    logo: 'block h-[18px] w-[18px] object-contain',
    label: 'min-w-0 truncate text-xs font-semibold text-vp-primary',
  },
};

export const ProviderLogoPlate: React.FC<ProviderLogoPlateProps> = ({
  src,
  name,
  variant = 'card',
}) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <span>{name}</span>;
  }

  const classes = VARIANT_CLASSES[variant];

  return (
    <span className={classes.plate}>
      <span className={classes.logoWrap}>
        <img
          src={src}
          alt={`${name} logo`}
          loading="lazy"
          decoding="async"
          className={classes.logo}
          onError={() => setFailed(true)}
        />
      </span>
      <span className={classes.label}>{name}</span>
    </span>
  );
};
