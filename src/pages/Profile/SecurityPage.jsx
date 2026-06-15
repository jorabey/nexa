import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { Field } from '../../components/common/Field';
import { Button } from '../../components/common/Button';
import { IconLock } from '../../components/common/icons';
import { userApi } from '../../api/user';
import { useToast } from '../../context/ToastContext';
import { useLang } from '../../context/LangContext';
import { ApiError } from '../../api/client';
import './sub-page.css';

export default function SecurityPage() {
  const { t } = useLang();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [appLock, setAppLock] = useState(false);
  const [twoFa, setTwoFa] = useState(false);

  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const [passError, setPassError] = useState('');

  const changePassword = async () => {
    setPassError('');
    if (!oldPass || !newPass || !confirmPass) {
      setPassError('Barcha maydonlarni to\'ldiring.');
      return;
    }
    if (newPass !== confirmPass) {
      setPassError('Yangi parollar bir xil emas.');
      return;
    }
    setPassLoading(true);
    try {
      await userApi.updatePassword(oldPass, newPass);
      showToast('Parol o\'zgartirildi', 'success');
      setOldPass(''); setNewPass(''); setConfirmPass('');
    } catch (err) {
      setPassError(err instanceof ApiError ? err.message : 'Xatolik');
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="sub-page">
      <PageHeader title={t('profile_security')} />
      <div className="sub-page__body">

        {/* Toggles */}
        <div>
          <p className="sub-section-title">{t('profile_security')}</p>
          <div className="sub-section">
            <div className="toggle-row">
              <div className="toggle-row__label">
                <span className="toggle-row__title">{t('security_app_lock')}</span>
                <span className="toggle-row__desc">{t('security_app_lock_desc')}</span>
              </div>
              <input
                type="checkbox"
                className="ios-toggle"
                checked={appLock}
                onChange={(e) => { setAppLock(e.target.checked); showToast(t('saved'), 'success'); }}
              />
            </div>
            <div className="toggle-row">
              <div className="toggle-row__label">
                <span className="toggle-row__title">{t('security_2fa')}</span>
                <span className="toggle-row__desc">{t('security_2fa_desc')}</span>
              </div>
              <input
                type="checkbox"
                className="ios-toggle"
                checked={twoFa}
                onChange={(e) => { setTwoFa(e.target.checked); showToast(t('saved'), 'success'); }}
              />
            </div>
          </div>
        </div>

        {/* Danger action */}
        <Button
          variant="danger"
          fullWidth
          onClick={() => {
            showToast(t('security_revoke_all_perms'), 'warn');
          }}
        >
          {t('security_revoke_all_perms')}
        </Button>

        {/* Change password */}
        <div>
          <p className="sub-section-title">{t('security_change_password')}</p>
          {passError && <div className="sub-error" style={{ marginBottom: 12 }}>{passError}</div>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Field
              label="Hozirgi parol"
              type="password"
              value={oldPass}
              onChange={(e) => setOldPass(e.target.value)}
              icon={<IconLock width={18} height={18} />}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <Field
              label={t('reset_new_password')}
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              icon={<IconLock width={18} height={18} />}
              placeholder="••••••••"
              autoComplete="new-password"
            />
            <Field
              label={t('reset_confirm_password')}
              type="password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              icon={<IconLock width={18} height={18} />}
              placeholder="••••••••"
              autoComplete="new-password"
            />
            <Button fullWidth loading={passLoading} onClick={changePassword}>
              {t('security_change_password')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
