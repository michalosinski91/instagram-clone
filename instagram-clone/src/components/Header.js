import React from 'react'
import '../styles/App.css';
import { Link } from 'react-router-dom'

const Header = () => {
    return (
        <nav className="Nav">
            <div className="Nav-manus">
                <div className="Nav-brand">
                    <Link className="Nav-brand-logo" to='/'>
                        Instagram
                    </Link>
                </div>

            </div>
        </nav>
    )
}

export default Header