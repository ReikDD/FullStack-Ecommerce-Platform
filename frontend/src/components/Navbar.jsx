import React, { useContext, useState, useEffect } from 'react';
import { FaHeart } from 'react-icons/fa';
import { Link, NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useLanguage } from '../context/LanguageContext';
import { ShopContext } from '../context/ShopContext';
import FontSizeControl from './FontSizeControl';

const Navbar = () => {

    const [visible, setVisible] = useState(false);
    const [hasPromotion, setHasPromotion] = useState(false);

    const { 
        setShowSearch, 
        getCartCount, 
        getWishlistCount, 
        navigate, 
        token, 
        setToken, 
        setCartItems, 
        checkWishlistPromotion, 
        products, 
        wishlistItems 
    } = useContext(ShopContext);
    
    const { language, toggleLanguage, t } = useLanguage();

    // 检查愿望单中是否有促销商品
    useEffect(() => {
        if (token && products.length > 0 && Object.keys(wishlistItems).length > 0) {
            // 检查是否有促销商品，但不显示通知
            const hasPromo = checkWishlistPromotion(false);
            setHasPromotion(hasPromo);
        } else {
            setHasPromotion(false);
        }
    }, [token, products, wishlistItems, checkWishlistPromotion]);

    const logout = () => {
        navigate('/login')
        localStorage.removeItem('token')
        setToken('')
        setCartItems({})
    }

    return (
        <div className='flex items-center justify-between py-5 font-medium'>

            <Link to='/'><img src={assets.logo} className='w-36' alt="" /></Link>

            <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>

                <NavLink to='/' className='flex flex-col items-center gap-1'>
                    <p>{t('home')}</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/collection' className='flex flex-col items-center gap-1'>
                    <p>{t('collection')}</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/about' className='flex flex-col items-center gap-1'>
                    <p>{t('about')}</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/contact' className='flex flex-col items-center gap-1'>
                    <p>{t('contact')}</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>

            </ul>

            <div className='flex items-center gap-6'>
                <img onClick={() => { setShowSearch(true); navigate('/collection') }} src={assets.search_icon} className='w-5 cursor-pointer' alt="" />

                {/* Font Size Control */}
                <FontSizeControl />

                {/* Language Toggle Button */}
                <button
                    onClick={toggleLanguage}
                    className='px-3 py-1 text-sm border rounded hover:bg-gray-100'
                >
                    {language === 'en' ? '中文' : 'EN'}
                </button>

                <div className='group relative'>
                    <img onClick={() => token ? null : navigate('/login')} className='w-5 cursor-pointer' src={assets.profile_icon} alt="" />
                    {/* Dropdown Menu */}
                    {token &&
                        <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
                            <div className='flex flex-col gap-2 w-36 py-3 px-5  bg-slate-100 text-gray-500 rounded'>
                                <p className='cursor-pointer hover:text-black'>{t('profile')}</p>
                                <p onClick={() => navigate('/orders')} className='cursor-pointer hover:text-black'>{t('orders')}</p>
                                <p onClick={() => navigate('/wishlist')} className='cursor-pointer hover:text-black'>
                                    {t('wishlist')}
                                    {hasPromotion && (
                                        <span className="ml-1 text-xs text-red-500">🔥</span>
                                    )}
                                </p>
                                <p onClick={logout} className='cursor-pointer hover:text-black'>{t('logout')}</p>
                            </div>
                        </div>}
                </div>

                {/* Wishlist Icon */}
                <div
                    onClick={() => token ? navigate('/wishlist') : navigate('/login')}
                    className='relative cursor-pointer'
                >
                    <FaHeart className={hasPromotion ? "text-red-500 w-5 h-5" : "text-gray-500 hover:text-red-500 w-5 h-5"} />
                    {token && getWishlistCount() > 0 && (
                        <div className='absolute right-[-5px] bottom-[-5px] w-4 h-4 bg-black text-white text-[8px] rounded-full flex items-center justify-center'>
                            {getWishlistCount()}
                        </div>
                    )}
                    {hasPromotion && (
                        <div className='absolute right-[-8px] top-[-8px] w-4 h-4 bg-red-500 text-white text-[8px] rounded-full flex items-center justify-center'>
                            🔥
                        </div>
                    )}
                </div>

                {/* Cart Icon */}
                <div
                    onClick={() => token ? navigate('/cart') : navigate('/login')}
                    className='relative cursor-pointer'
                >
                    <img src={assets.cart_icon} className='w-5 min-w-5' alt="" />
                    {token && getCartCount() > 0 && (
                        <div className='absolute right-[-5px] bottom-[-5px] w-4 h-4 bg-black text-white text-[8px] rounded-full flex items-center justify-center'>
                            {getCartCount()}
                        </div>
                    )}
                </div>

                <img onClick={() => setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="" />
            </div>

            {/* Sidebar menu for small screens */}
            <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
                <div className='flex flex-col text-gray-600'>
                    <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
                        <img className='h-4 rotate-180' src={assets.dropdown_icon} alt="" />
                        <p>{language === 'en' ? 'Back' : '返回'}</p>
                    </div>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/'>{t('home')}</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/collection'>{t('collection')}</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/about'>{t('about')}</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/contact'>{t('contact')}</NavLink>
                    <div
                        onClick={() => {
                            setVisible(false);
                            token ? navigate('/wishlist') : navigate('/login');
                        }}
                        className='py-2 pl-6 border cursor-pointer flex items-center gap-2'
                    >
                        <FaHeart className={hasPromotion ? "text-red-500 w-4 h-4" : "text-gray-500 w-4 h-4"} />
                        <span>{t('wishlist')}</span>
                        {token && getWishlistCount() > 0 && (
                            <span className='ml-1 bg-black text-white w-4 h-4 text-center rounded-full text-xs'>
                                {getWishlistCount()}
                            </span>
                        )}
                        {hasPromotion && (
                            <span className="ml-1 text-red-500">🔥</span>
                        )}
                    </div>
                    <div
                        onClick={() => {
                            setVisible(false);
                            token ? navigate('/cart') : navigate('/login');
                        }}
                        className='py-2 pl-6 border cursor-pointer flex items-center gap-2'
                    >
                        <img src={assets.cart_icon} className='w-4' alt="" />
                        <span>{t('cart')}</span>
                        {token && getCartCount() > 0 && (
                            <span className='ml-1 bg-black text-white w-4 h-4 text-center rounded-full text-xs'>
                                {getCartCount()}
                            </span>
                        )}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Navbar
