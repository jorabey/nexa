import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { Field } from '../../components/common/Field';
import { Button } from '../../components/common/Button';
import {
  IconMail,
  IconLock,
  IconUser,
  IconPhone,
  IconCalendar,
} from '../../components/common/icons';
import { authApi } from '../../api/auth';
import { useLang } from '../../context/LangContext';
import { ApiError } from '../../api/client';

const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export default function RegisterPage() {
  const { t } = useLang();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    gender: 'male',
    phone: '',
    email: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError(`${t('register_firstname')} / ${t('register_lastname')}`);
      return;
    }
    if (!/^[a-zA-Z0-9]{3,30}$/.test(form.username)) {
      setError('Username 3-30 ta harf/raqamdan iborat bo\u02bblishi kerak.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError('Email manzilini to\u02bbg\u02bbri kiriting.');
      return;
    }
    if (!PASSWORD_RE.test(form.password)) {
      setError('Parol kamida 8 ta belgi, katta-kichik harf, raqam va maxsus belgi (@$!%*?&) saqlashi shart.');
      return;
    }

    setLoading(true);
    try {
      await authApi.sendOtp(form.email.trim().toLowerCase());
      navigate('/verify', {
        state: {
          mode: 'register',
          payload: {
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            dob: form.dob || undefined,
            gender: form.gender,
            phone: form.phone.trim() || undefined,
            email: form.email.trim().toLowerCase(),
            username: form.username.trim(),
            password: form.password,
          },
        },
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Xatolik yuz berdi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={t('register_title')}
      subtitle={t('register_subtitle')}
      footer={
        <span>
          {t('register_have_account')}{' '}
          <Link to="/login" className="auth-link" style={{ display: 'inline' }}>
            {t('register_login_link')}
          </Link>
        </span>
      }
    >
      <form onSubmit={onSubmit} className="auth__body" noValidate>
        {error && <div className="auth-error">{error}</div>}

        <div className="auth-row">
          <Field
            label={t('register_firstname')}
            value={form.firstName}
            onChange={update('firstName')}
            icon={<IconUser width={18} height={18} />}
            placeholder="Ism"
            autoComplete="given-name"
          />
          <Field
            label={t('register_lastname')}
            value={form.lastName}
            onChange={update('lastName')}
            placeholder="Familya"
            autoComplete="family-name"
          />
        </div>

        <div className="auth-row">
          <Field
            label={t('register_dob')}
            type="date"
            value={form.dob}
            onChange={update('dob')}
            icon={<IconCalendar width={18} height={18} />}
            max={new Date().toISOString().slice(0, 10)}
          />
          <Field
            label={t('register_gender')}
            as="select"
            value={form.gender}
            onChange={update('gender')}
            options={[
              { value: 'male', label: t('gender_male') },
              { value: 'female', label: t('gender_female') },
              { value: 'other', label: t('gender_other') },
            ]}
          />
        </div>

        <Field
          label={t('register_phone')}
          type="tel"
          value={form.phone}
          onChange={update('phone')}
          icon={<IconPhone width={18} height={18} />}
          placeholder="+998 90 123 45 67"
          autoComplete="tel"
        />

        <Field
          label={t('register_email')}
          type="email"
          value={form.email}
          onChange={update('email')}
          icon={<IconMail width={18} height={18} />}
          placeholder="email@misol.uz"
          autoComplete="email"
        />

        <Field
          label={t('register_username')}
          value={form.username}
          onChange={update('username')}
          icon={<IconUser width={18} height={18} />}
          placeholder="username"
          autoComplete="username"
        />

        <Field
          label={t('register_password')}
          type="password"
          value={form.password}
          onChange={update('password')}
          icon={<IconLock width={18} height={18} />}
          placeholder="••••••••"
          hint="Kamida 8 belgi: A-Z, a-z, 0-9, @$!%*?&"
          autoComplete="new-password"
        />

        <Button type="submit" fullWidth size="lg" loading={loading}>
          {t('register_submit')}
        </Button>
      </form>
    </AuthLayout>
  );
}
