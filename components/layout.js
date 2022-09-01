import Navbar from './navbar'
import Footer from './footer'

export default function Layout({ children }) {
    return (
        <>
            <Navbar links={[] /*data.links*/} />
            <main>{children}</main>
            <Footer />
        </>
    )
}