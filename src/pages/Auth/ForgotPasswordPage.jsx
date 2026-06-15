import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { Field } from '../../components/common/Field';
import { Button } from '../../components/common/Button';
import { IconMail } from '../../components/common/icons';
import { authApi } from '../../api/auth';
import { useLang } from '../../context/LangContext';
import { ApiError } from '../../api/client';

export default function ForgotPasswordPage() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Email manzilini to\'g\'ri kiriting.');
      return;
    }
    setLoading(true);
    try {
      await authApi.sendOtp(email.trim().toLowerCase());
      navigate('/verify', {
        state: { mode: 'forgot', email: email.trim().toLowerCase() },
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Xatolik yuz berdi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={t('forgot_title')}
      subtitle={t('forgot_subtitle')}
      footer={
        <Link to="/login" className="auth-link" style={{ display: 'inline' }}>
          {t('forgot_back')}
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="auth__body" noValidate>
        {error && <div className="auth-error">{error}</div>}
        <Field
          label={t('register_email')}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<IconMail width={18} height={18} />}
          placeholder="email@misol.uz"
          autoComplete="email"
        />
        <Button type="submit" fullWidth size="lg" loading={loading}>
          {t('forgot_submit')}
        </Button>
      </form>
    </AuthLayout>
  );
}
