import { useState, FormEvent } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/user.service';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const ProfilePage = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileLoading, setProfileLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      await userService.updateProfile({ name, email });
      toast.success('Profile updated');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setPasswordLoading(true);
    try {
      await userService.changePassword({ currentPassword, newPassword, confirmPassword });
      toast.success('Password changed');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Profile</h1>
          <p className="page-subtitle">Manage your account settings</p>
        </div>
      </div>

      <div className="profile-grid">
        <div className="card">
          <h2 className="card-title" style={{ marginBottom: '1.25rem' }}>Personal Information</h2>
          <form onSubmit={handleProfileUpdate}>
            <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <div className="form-group">
              <label className="form-label">Role</label>
              <input className="form-input" value={user?.role || ''} disabled />
            </div>
            <Button type="submit" loading={profileLoading}>Save Changes</Button>
          </form>
        </div>

        <div className="card">
          <h2 className="card-title" style={{ marginBottom: '1.25rem' }}>Change Password</h2>
          <form onSubmit={handlePasswordChange}>
            <Input
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
            />
            <Input
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button type="submit" loading={passwordLoading}>Update Password</Button>
          </form>
        </div>
      </div>
    </div>
  );
};
