import React, { useState } from 'react';

interface ProviderLogoPlateProps {
  src?: string;
  name: string;
  variant?: 'card' | 'detail';
}

const VARIANT_CLASSES = {
  card: {
    plate: 'inline-flex h-[30px] min-w-[72px] max-w-[120px] items-center justify-center rounded-md bg-white px-2.5 py-[5px]',
    logo: 'block h-auto w-auto max-h-[18px] max-w-[100px] object-contain',
  },
  detail: {
    plate: 'inline-flex h-[30px] min-w-[72px] max-w-[120px] items-center justify-center rounded-md bg-white px-2.5 py-[5px]',
    logo: 'block h-auto w-auto max-h-[18px] max-w-[100px] object-contain',
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
      <img
        src={src}
        alt={`${name} logo`}
        loading="lazy"
        decoding="async"
        className={classes.logo}
        onError={() => setFailed(true)}
      />
    </span>
  );
};
