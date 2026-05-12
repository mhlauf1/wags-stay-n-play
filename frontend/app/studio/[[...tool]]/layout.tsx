export default function StudioLayout({children}: {children: React.ReactNode}) {
  return (
    <>
      <style>{`
        header, footer, #draft-mode-toast { display: none !important; }
        main { padding: 0 !important; margin: 0 !important; }
      `}</style>
      {children}
    </>
  )
}
