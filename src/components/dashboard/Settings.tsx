import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings as SettingsIcon, User, Bell, Shield, Map } from "lucide-react";
import { useState } from 'react';

export function Settings() {
  const [settings, setSettings] = useState({
    userProfile: {
      name: 'Vatsav Sharma',
      role: 'Emergency Operator',
      contact: '+91 9821123456',
      languages: 'Hindi, English, Marathi',
    },
    notifications: {
      criticalAlerts: true,
      audioAlerts: true,
      desktopNotifications: false,
      emailSummaries: true,
    },
    security: {
      twoFactorAuth: true,
      autoLogout: true,
      sessionTimeout: '30',
    },
    map: {
      mapStyle: 'satellite',
      realTimeTracking: true,
      trafficLayer: false,
      refreshRate: '5',
    },
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSettings(prev => ({ ...prev, userProfile: { ...prev.userProfile, [id]: value } }));
  };

  const handleNotificationChange = (id: string, checked: boolean) => {
    setSettings(prev => ({ ...prev, notifications: { ...prev.notifications, [id]: checked } }));
  };

  const handleSecurityChange = (id: string, value: string | boolean) => {
     if (typeof value === 'boolean') {
      setSettings(prev => ({ ...prev, security: { ...prev.security, [id]: value } }));
    } else {
      setSettings(prev => ({ ...prev, security: { ...prev.security, sessionTimeout: value } }));
    }
  };

  const handleMapChange = (id: string, value: string | boolean) => {
    if (typeof value === 'boolean') {
      setSettings(prev => ({ ...prev, map: { ...prev.map, [id]: value } }));
    } else {
      setSettings(prev => ({ ...prev, map: { ...prev.map, [id]: value } }));
    }
  };

  const handleSave = () => {
    console.log('Settings saved:', settings);
    alert('Settings saved successfully! (Check console for details)');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <SettingsIcon className="w-8 h-8 text-accent-main" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Configure your emergency dashboard preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Profile */}
        <Card className="p-6 bg-bg-elevated border-border">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-accent-main" />
            <h2 className="text-lg font-semibold text-foreground">User Profile</h2>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</Label>
              <Input id="name" value={settings.userProfile.name} onChange={handleProfileChange} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="role" className="text-sm font-medium text-foreground">Role</Label>
              <Input id="role" value={settings.userProfile.role} onChange={handleProfileChange} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="contact" className="text-sm font-medium text-foreground">Contact</Label>
              <Input id="contact" value={settings.userProfile.contact} onChange={handleProfileChange} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="languages" className="text-sm font-medium text-foreground">Languages</Label>
              <Input id="languages" value={settings.userProfile.languages} onChange={handleProfileChange} className="mt-1" />
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6 bg-bg-elevated border-border">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-accent-main" />
            <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-foreground">Critical Alerts</Label>
                <p className="text-xs text-muted-foreground">Immediate notifications for critical incidents</p>
              </div>
              <Switch id="criticalAlerts" checked={settings.notifications.criticalAlerts} onCheckedChange={(checked) => handleNotificationChange('criticalAlerts', checked)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-foreground">Audio Alerts</Label>
                <p className="text-xs text-muted-foreground">Sound notifications for new calls</p>
              </div>
              <Switch id="audioAlerts" checked={settings.notifications.audioAlerts} onCheckedChange={(checked) => handleNotificationChange('audioAlerts', checked)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-foreground">Desktop Notifications</Label>
                <p className="text-xs text-muted-foreground">Browser notifications when minimized</p>
              </div>
              <Switch id="desktopNotifications" checked={settings.notifications.desktopNotifications} onCheckedChange={(checked) => handleNotificationChange('desktopNotifications', checked)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-foreground">Email Summaries</Label>
                <p className="text-xs text-muted-foreground">Daily incident summary reports</p>
              </div>
              <Switch id="emailSummaries" checked={settings.notifications.emailSummaries} onCheckedChange={(checked) => handleNotificationChange('emailSummaries', checked)} />
            </div>
          </div>
        </Card>

        {/* Security */}
        <Card className="p-6 bg-bg-elevated border-border">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-accent-main" />
            <h2 className="text-lg font-semibold text-foreground">Security</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-foreground">Two-Factor Authentication</Label>
                <p className="text-xs text-muted-foreground">Additional security for your account</p>
              </div>
              <Switch id="twoFactorAuth" checked={settings.security.twoFactorAuth} onCheckedChange={(checked) => handleSecurityChange('twoFactorAuth', checked)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-foreground">Auto Logout</Label>
                <p className="text-xs text-muted-foreground">Automatic logout after inactivity</p>
              </div>
              <Switch id="autoLogout" checked={settings.security.autoLogout} onCheckedChange={(checked) => handleSecurityChange('autoLogout', checked)} />
            </div>
            <div>
              <Label htmlFor="timeout" className="text-sm font-medium text-foreground">Session Timeout</Label>
              <Select value={settings.security.sessionTimeout} onValueChange={(value) => handleSecurityChange('sessionTimeout', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Map Settings */}
        <Card className="p-6 bg-bg-elevated border-border">
          <div className="flex items-center gap-3 mb-6">
            <Map className="w-5 h-5 text-accent-main" />
            <h2 className="text-lg font-semibold text-foreground">Map Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="mapStyle" className="text-sm font-medium text-foreground">Map Style</Label>
              <Select value={settings.map.mapStyle} onValueChange={(value) => handleMapChange('mapStyle', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="satellite">Satellite</SelectItem>
                  <SelectItem value="streets">Streets</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="terrain">Terrain</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-foreground">Real-time Tracking</Label>
                <p className="text-xs text-muted-foreground">Live unit position updates</p>
              </div>
              <Switch id="realTimeTracking" checked={settings.map.realTimeTracking} onCheckedChange={(checked) => handleMapChange('realTimeTracking', checked)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-foreground">Traffic Layer</Label>
                <p className="text-xs text-muted-foreground">Show current traffic conditions</p>
              </div>
              <Switch id="trafficLayer" checked={settings.map.trafficLayer} onCheckedChange={(checked) => handleMapChange('trafficLayer', checked)} />
            </div>
            <div>
              <Label htmlFor="refreshRate" className="text-sm font-medium text-foreground">Refresh Rate</Label>
              <Select value={settings.map.refreshRate} onValueChange={(value) => handleMapChange('refreshRate', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 second</SelectItem>
                  <SelectItem value="5">5 seconds</SelectItem>
                  <SelectItem value="10">10 seconds</SelectItem>
                  <SelectItem value="30">30 seconds</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button size="lg" onClick={handleSave}>
          Save Settings
        </Button>
      </div>
    </div>
  );
}