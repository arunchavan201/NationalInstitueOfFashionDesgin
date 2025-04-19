import React from 'react';

export default function Favicon() {
  return (
    <>
      <link rel="icon" type="image/svg+xml" href="/logo.svg" />
      <link rel="apple-touch-icon" sizes="180x180" href="/logo.svg" />
      <link rel="icon" type="image/svg+xml" sizes="32x32" href="/logo.svg" />
      <link rel="icon" type="image/svg+xml" sizes="16x16" href="/logo.svg" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/logo.svg" color="#C9366F" />
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="theme-color" content="#ffffff" />
    </>
  );
}
