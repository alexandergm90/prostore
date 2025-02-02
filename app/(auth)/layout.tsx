export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex-center h-screen w-full">
            {children}
        </div>
    );
}
