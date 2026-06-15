import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { appsApi } from '../../api/apps';
import { useLang } from '../../context/LangContext';
import { IconChevronLeft, IconRefresh } from '../../components/common/icons';
import { OrbitLoader } from '../../components/common/OrbitMark';
import './webview.css';

export default function WebViewPage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { t } = useLang();

  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [iframeReady, setIframeReady] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // 🚀 Dynamic Island holati (Yopiq/Ochiq)
  const iframeRef = useRef(null);

  useEffect(() => {
    appsApi.getAppDetails(username)
      .then(({ data }) => setApp(data.app))
      .catch(() => navigate('/apps', { replace: true }))
      .finally(() => setLoading(false));
  }, [username, navigate]);

  // 🔒 SECURITY LAYER: Tizim funksiyalarini qulflash
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    const handleKeyDown = (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) ||
        (e.ctrlKey && (e.key === 'U' || e.key === 'u' || e.key === 'S' || e.key === 's'))
      ) {
        e.preventDefault();
        return false;
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    let meta = document.querySelector('meta[name="viewport"]');
    if (meta) {
      meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
    }

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleBack = () => {
    navigate('/apps', { replace: true }); 
  };

  const reload = () => {
    if (iframeRef.current) {
      setIframeReady(false);
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  return (
    <div className="webview app-kiosk-mode">
      
      {/* 🚀 TOP SCREEN PROGRESS BAR */}
      {!iframeReady && !loading && (
        <div className="webview__progress" />
      )}

      {/* 🚀 IPHONE DYNAMIC ISLAND PANEL */}
      {!loading && app && (
        <div 
          className={`webview__island ${isExpanded ? 'webview__island--expanded' : ''}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* Orqaga qaytish tugmasi (Faqat kengayganda chiqadi) */}
          <button 
            className="webview__btn webview__btn--back" 
            onClick={(e) => { e.stopPropagation(); handleBack(); }} 
            aria-label="Back"
          >
            <IconChevronLeft width={18} height={18} />
          </button>

          {/* Markaziy qism: Rasm va Nom */}
          <div className="webview__title-row">
            {app?.iconUrl && (
              <img src={app.iconUrl} alt="" className="webview__app-icon" />
            )}
            <span className="webview__app-name">{app?.name || username}</span>
          </div>

          {/* Refresh tugmasi (Faqat kengayganda chiqadi) */}
          <button 
            className="webview__btn webview__btn--refresh" 
            onClick={(e) => { e.stopPropagation(); reload(); }} 
            aria-label="Reload"
          >
            <IconRefresh width={16} height={16} />
          </button>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      {loading ? (
        <div className="webview__loader">
          <OrbitLoader size={44} />
        </div>
      ) : app ? (
        <iframe
          ref={iframeRef}
          src={app.appUrl}
          className="webview__iframe"
          title={app.name}
          onLoad={() => setIframeReady(true)}
          sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
          allow="camera; microphone; geolocation; payment"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : null}
    </div>
  );
}