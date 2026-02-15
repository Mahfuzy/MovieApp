const Footer = () => {
    return (
        <div className="bg-gray-800 text-gray-400 py-8 px-4">
            <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                    <ul className="space-y-2">
                        <li><a href="#contact" className="hover:text-white transition">Questions? Contact Us.</a></li>
                        <li><a href="#faq" className="hover:text-white transition">FAQ</a></li>
                        <li><a href="#investors" className="hover:text-white transition">Investor Relations</a></li>
                        <li><a href="#privacy" className="hover:text-white transition">Privacy</a></li>
                        <li><a href="#speed" className="hover:text-white transition">Speed Test</a></li>
                    </ul>
                </div>
                <div>
                    <ul className="space-y-2">
                        <li><a href="#help" className="hover:text-white transition">Help Center</a></li>
                        <li><a href="#jobs" className="hover:text-white transition">Jobs</a></li>
                        <li><a href="#cookies" className="hover:text-white transition">Cookie Preferences</a></li>
                        <li><a href="#legal" className="hover:text-white transition">Legal Notices</a></li>
                    </ul>
                </div>
                <div>
                    <ul className="space-y-2">
                        <li><a href="#account" className="hover:text-white transition">Account</a></li>
                        <li><a href="#watch" className="hover:text-white transition">Ways to Watch</a></li>
                        <li><a href="#corporate" className="hover:text-white transition">Corporate Information</a></li>
                        <li><a href="#originals" className="hover:text-white transition">Originals</a></li>
                    </ul>
                </div>
                <div>
                    <ul className="space-y-2">
                        <li><a href="#media" className="hover:text-white transition">Media Center</a></li>
                        <li><a href="#terms" className="hover:text-white transition">Terms of Use</a></li>
                        <li><a href="#contact-us" className="hover:text-white transition">Contact Us</a></li>
                    </ul>
                </div>
            </div>
            <div className="container mx-auto mt-8 pt-4 border-t border-gray-700 text-center text-sm">
                <p>&copy; {new Date().getFullYear()} Movies Hub. All rights reserved.</p>
            </div>
        </div>
    );
};

export default Footer;