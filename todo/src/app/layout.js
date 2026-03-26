import './global.css'


export default function RootLayout({ children }) {
  return (
    <html>
      <body className='flex flex-col items-center justify-center min-h-full'>
        <h1 className='text-3xl'>Todo Application</h1>
        {children}
      </body>
    </html>
  );
}
