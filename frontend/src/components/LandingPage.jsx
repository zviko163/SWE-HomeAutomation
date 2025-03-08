import React from 'react';
import { Link } from 'react-router-dom';

// Import Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowRight, faTemperatureHigh, faShieldAlt, faLightbulb,
    faBrain, faMobileAlt, faChartLine, faSlidersH
} from '@fortawesome/free-solid-svg-icons';
import {
    faFacebookF, faTwitter, faInstagram, faGithub
} from '@fortawesome/free-brands-svg-icons';

const LandingPage = () => {
    return (
        <>
            {/* Navigation */}
            <nav className="navbar navbar-expand-lg sticky-top">
                <div className="container">
                    <Link className="navbar-brand" to="/">
                        <span className="fw-bold">Home Bot</span>
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <a className="nav-link" href="#features">Features</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#how-it-works">How it Works</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#testimonials">Testimonials</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#dashboard">Dashboard</a>
                            </li>
                        </ul>
                        <div className="ms-lg-3 mt-3 mt-lg-0">
                            <Link to="/login" className="btn btn-primary rounded-pill px-4">Login</Link>
                            <Link to="/signup" className="btn btn-outline rounded-pill px-4 ms-2">Sign Up</Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="hero" className="min-vh-100 d-flex align-items-center">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-5 mb-lg-0 animate-on-scroll">
                            <h1 className="display-3 fw-bold mb-4">Smart Home Automation at Your Fingertips</h1>
                            <p className="lead mb-4">Control your home with ease using our IoT-powered smart home system. Monitor sensors, automate appliances, and secure your home from anywhere.</p>
                            <div className="d-flex flex-wrap gap-3">
                                <Link to="/signup" className="btn btn-primary btn-lg rounded-pill">
                                    Get Started <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                                </Link>
                                <a href="#how-it-works" className="btn btn-outline btn-lg rounded-pill">Learn More</a>
                            </div>
                        </div>
                        <div className="col-lg-6 text-center animate-on-scroll delay-1">
                            <div className="hero-img-container glass" style={{
                                maxHeight: '800px',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <img
                                    src={`${process.env.PUBLIC_URL}/assets/images/smart-home-hero.jpeg`}
                                    alt="Home Bot Dashboard"
                                    className="img-fluid"
                                    style={{
                                        objectFit: 'cover',
                                        width: '100%',
                                        height: '100%',
                                        maxHeight: '800px',
                                        borderRadius: '20px'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="bg-light">
                <div className="container">
                    <div className="row text-center mb-5">
                        <div className="col-lg-8 mx-auto animate-on-scroll">
                            <h2 className="fs-1 fw-bold mb-3">Smart Features for a Smarter Home</h2>
                            <p className="lead">Everything you need to transform your house into an intelligent, responsive environment.</p>
                        </div>
                    </div>
                    <div className="row g-4">
                        {/* Feature 1 */}
                        <div className="col-md-6 col-lg-3 animate-on-scroll">
                            <div className="card h-100 glass border-0">
                                <div className="card-body text-center p-4">
                                    <div className="feature-icon bg-primary rounded-circle mb-4 mx-auto">
                                        <FontAwesomeIcon icon={faTemperatureHigh} />
                                    </div>
                                    <h3 className="fs-4 mb-3">Temperature Control</h3>
                                    <p>Monitor and control temperature in real-time from anywhere using our mobile app.</p>
                                </div>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="col-md-6 col-lg-3 animate-on-scroll delay-1">
                            <div className="card h-100 glass border-0">
                                <div className="card-body text-center p-4">
                                    <div className="feature-icon bg-primary rounded-circle mb-4 mx-auto">
                                        <FontAwesomeIcon icon={faShieldAlt} />
                                    </div>
                                    <h3 className="fs-4 mb-3">Security System</h3>
                                    <p>Get instant alerts for motion detection and unauthorized access to keep your home safe.</p>
                                </div>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="col-md-6 col-lg-3 animate-on-scroll delay-2">
                            <div className="card h-100 glass border-0">
                                <div className="card-body text-center p-4">
                                    <div className="feature-icon bg-primary rounded-circle mb-4 mx-auto">
                                        <FontAwesomeIcon icon={faLightbulb} />
                                    </div>
                                    <h3 className="fs-4 mb-3">Smart Lighting</h3>
                                    <p>Automate your lights based on time, presence, or custom schedules for energy efficiency.</p>
                                </div>
                            </div>
                        </div>

                        {/* Feature 4 */}
                        <div className="col-md-6 col-lg-3 animate-on-scroll delay-3">
                            <div className="card h-100 glass border-0">
                                <div className="card-body text-center p-4">
                                    <div className="feature-icon bg-primary rounded-circle mb-4 mx-auto">
                                        <FontAwesomeIcon icon={faBrain} />
                                    </div>
                                    <h3 className="fs-4 mb-3">AI Predictions</h3>
                                    <p>Get smart recommendations and forecasts based on your usage patterns and preferences.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="bg-dark-green text-white">
                <div className="container">
                    <div className="row text-center mb-5">
                        <div className="col-lg-8 mx-auto animate-on-scroll">
                            <h2 className="fs-1 fw-bold mb-3">How It Works</h2>
                            <p className="lead">Simple yet powerful, our system connects seamlessly with your home.</p>
                        </div>
                    </div>
                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-4 mb-lg-0 animate-on-scroll">
                            <img
                                src={`${process.env.PUBLIC_URL}/assets/images/how-it-works.jpg`}
                                alt="How Home Bot Works"
                                className="img-fluid rounded glass"
                            />
                        </div>
                        <div className="col-lg-6">
                            <div className="steps">
                                <div className="step d-flex mb-4 animate-on-scroll">
                                    <div className="step-number">01</div>
                                    <div className="step-content ms-4">
                                        <h3 className="fs-4 mb-2">Connect Devices</h3>
                                        <p>Connect your ESP32 devices to the Home Bot network with our easy setup process.</p>
                                    </div>
                                </div>
                                <div className="step d-flex mb-4 animate-on-scroll delay-1">
                                    <div className="step-number">02</div>
                                    <div className="step-content ms-4">
                                        <h3 className="fs-4 mb-2">Configure Settings</h3>
                                        <p>Customize your dashboard and create automation rules through our intuitive interface.</p>
                                    </div>
                                </div>
                                <div className="step d-flex mb-4 animate-on-scroll delay-2">
                                    <div className="step-number">03</div>
                                    <div className="step-content ms-4">
                                        <h3 className="fs-4 mb-2">Control & Monitor</h3>
                                        <p>Take full control of your home environment from our web or mobile dashboard.</p>
                                    </div>
                                </div>
                                <div className="step d-flex animate-on-scroll delay-3">
                                    <div className="step-number">04</div>
                                    <div className="step-content ms-4">
                                        <h3 className="fs-4 mb-2">Get Insights</h3>
                                        <p>Receive personalized insights and predictions to optimize your home's efficiency.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dashboard Preview Section */}
            <section id="dashboard">
                <div className="container">
                    <div className="row text-center mb-5">
                        <div className="col-lg-8 mx-auto animate-on-scroll">
                            <h2 className="fs-1 fw-bold mb-3">Powerful Dashboard</h2>
                            <p className="lead">Everything you need in one place - monitor, control, and automate with ease.</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 animate-on-scroll">
                            <div className="dashboard-preview glass p-3 p-md-5">
                                <img
                                    src={`${process.env.PUBLIC_URL}/assets/images/dashboard-preview.png`}
                                    alt="Home Bot Dashboard"
                                    className="img-fluid w-100 rounded"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row mt-5 g-4">
                        <div className="col-md-4 animate-on-scroll">
                            <div className="text-center">
                                <div className="icon-circle bg-primary mb-3 mx-auto">
                                    <FontAwesomeIcon icon={faMobileAlt} />
                                </div>
                                <h3 className="fs-4 mb-2">Responsive Design</h3>
                                <p>Access your dashboard from any device - desktop, tablet, or smartphone.</p>
                            </div>
                        </div>
                        <div className="col-md-4 animate-on-scroll delay-1">
                            <div className="text-center">
                                <div className="icon-circle bg-primary mb-3 mx-auto">
                                    <FontAwesomeIcon icon={faChartLine} />
                                </div>
                                <h3 className="fs-4 mb-2">Real-time Analytics</h3>
                                <p>Get instant updates and historical data visualization for all connected sensors.</p>
                            </div>
                        </div>
                        <div className="col-md-4 animate-on-scroll delay-2">
                            <div className="text-center">
                                <div className="icon-circle bg-primary mb-3 mx-auto">
                                    <FontAwesomeIcon icon={faSlidersH} />
                                </div>
                                <h3 className="fs-4 mb-2">Customizable</h3>
                                <p>Tailor your dashboard layout and widgets to fit your specific needs.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="bg-secondary">
                <div className="container">
                    <div className="row text-center mb-5">
                        <div className="col-lg-8 mx-auto animate-on-scroll">
                            <h2 className="fs-1 fw-bold mb-3">What Our Users Say</h2>
                            <p className="lead">Join thousands of satisfied homeowners who've transformed their living spaces.</p>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-lg-10 animate-on-scroll">
                            <div id="testimonialCarousel" className="carousel slide" data-bs-ride="carousel">
                                <div className="carousel-inner">
                                    <div className="carousel-item active">
                                        <div className="testimonial-item glass p-4 p-md-5 text-center">
                                            <div className="testimonial-img mb-4">
                                                <img
                                                    src={`${process.env.PUBLIC_URL}/assets/images/testimonial-1.jpg`}
                                                    alt="User Testimonial"
                                                    className="rounded-circle"
                                                />
                                            </div>
                                            <p className="fs-5 mb-4">"Home Bot has completely transformed how I interact with my house. The temperature predictions saved me over 20% on my energy bill last month!"</p>
                                            <h5 className="mb-1">Nana Akua Badu</h5>
                                            <p className="text-muted">Homeowner, Accra</p>
                                        </div>
                                    </div>
                                    <div className="carousel-item">
                                        <div className="testimonial-item glass p-4 p-md-5 text-center">
                                            <div className="testimonial-img mb-4">
                                                <img
                                                    src={`${process.env.PUBLIC_URL}/assets/images/testimonial-2.jpg`}
                                                    alt="User Testimonial"
                                                    className="rounded-circle"
                                                />
                                            </div>
                                            <p className="fs-5 mb-4">"The security features give me peace of mind, especially when I'm traveling. Being able to check my home from anywhere is incredibly convenient."</p>
                                            <h5 className="mb-1">Michael Chengetai</h5>
                                            <p className="text-muted">Tech Enthusiast, Harare</p>
                                        </div>
                                    </div>
                                    <div className="carousel-item">
                                        <div className="testimonial-item glass p-4 p-md-5 text-center">
                                            <div className="testimonial-img mb-4">
                                                <img
                                                    src={`${process.env.PUBLIC_URL}/assets/images/testimonial-3.jpg`}
                                                    alt="User Testimonial"
                                                    className="rounded-circle"
                                                />
                                            </div>
                                            <p className="fs-5 mb-4">"As someone who's not tech-savvy, I was surprised by how easy it was to set up Home Bot. The interface is intuitive and the automations are life-changing!"</p>
                                            <h5 className="mb-1">Fadzai Magwenzi</h5>
                                            <p className="text-muted">Artist, Bulawayo</p>
                                        </div>
                                    </div>
                                </div>
                                <button className="carousel-control-prev" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="cta" className="bg-primary text-dark">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8 mb-4 mb-lg-0 animate-on-scroll">
                            <h2 className="fs-1 fw-bold mb-3">Ready to transform your home?</h2>
                            <p className="lead mb-0">Get started with Home Bot today and experience the future of smart living.</p>
                        </div>
                        <div className="col-lg-4 text-lg-end animate-on-scroll delay-1">
                            <Link to="/signup" className="btn btn-dark btn-lg rounded-pill">Get Started Now</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-5 bg-dark-sienna text-white">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-lg-4 mb-4 mb-lg-0">
                            <h3 className="fs-4 mb-4">Home Bot</h3>
                            <p>The next generation of smart home automation, bringing intelligence and convenience to every corner of your living space.</p>
                            <div className="social-icons mt-4">
                                <a href="#" className="me-3"><FontAwesomeIcon icon={faFacebookF} /></a>
                                <a href="#" className="me-3"><FontAwesomeIcon icon={faTwitter} /></a>
                                <a href="#" className="me-3"><FontAwesomeIcon icon={faInstagram} /></a>
                                <a href="#"><FontAwesomeIcon icon={faGithub} /></a>
                            </div>
                        </div>
                        <div className="col-sm-6 col-lg-2">
                            <h5 className="mb-4">Links</h5>
                            <ul className="list-unstyled">
                                <li className="mb-2"><Link to="/" className="footer-link">Home</Link></li>
                                <li className="mb-2"><a href="#features" className="footer-link">Features</a></li>
                                <li className="mb-2"><a href="#how-it-works" className="footer-link">How it Works</a></li>
                                <li className="mb-2"><a href="#testimonials" className="footer-link">Testimonials</a></li>
                            </ul>
                        </div>
                        <div className="col-sm-6 col-lg-2">
                            <h5 className="mb-4">Support</h5>
                            <ul className="list-unstyled">
                                <li className="mb-2"><Link to="/faq" className="footer-link">FAQs</Link></li>
                                <li className="mb-2"><Link to="/docs" className="footer-link">Documentation</Link></li>
                                <li className="mb-2"><Link to="/community" className="footer-link">Community</Link></li>
                                <li className="mb-2"><Link to="/contact" className="footer-link">Contact Us</Link></li>
                            </ul>
                        </div>
                        <div className="col-lg-4">
                            <h5 className="mb-4">Subscribe to Our Newsletter</h5>
                            <p>Get the latest updates and news about Home Bot.</p>
                            <div className="input-group mt-3">
                                <input type="email" className="form-control" placeholder="Your email address" aria-label="Your email address" />
                                <button className="btn btn-primary" type="button">Subscribe</button>
                            </div>
                        </div>
                    </div>
                    <hr className="my-5" />
                    <div className="row">
                        <div className="col-md-6 mb-3 mb-md-0">
                            <p className="mb-0">&copy; 2025 Home Bot. All rights reserved.</p>
                        </div>
                        <div className="col-md-6 text-md-end">
                            <ul className="list-inline mb-0">
                                <li className="list-inline-item"><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
                                <li className="list-inline-item"><Link to="/terms" className="footer-link">Terms of Service</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default LandingPage;
