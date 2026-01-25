// PushNotificationDiagnostic.jsx
// Temporary diagnostic component to troubleshoot push notifications
// Add to your app temporarily to diagnose issues

import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { isPushSupported, getCurrentSubscription } from '../services/pushSubscription';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Bell } from 'lucide-react';

const PushNotificationDiagnostic = () => {
  const [checks, setChecks] = useState({
    browserSupport: null,
    permission: null,
    serviceWorker: null,
    pushSubscription: null,
    subscriptionInDB: null,
    userId: null,
    pendingNotifications: null,
    vapidKey: null,
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [dbSubscription, setDbSubscription] = useState(null);
  const [pendingNotifs, setPendingNotifs] = useState([]);

  const runDiagnostics = async () => {
    setLoading(true);
    const results = { ...checks };

    // 1. Check browser support
    results.browserSupport = isPushSupported();

    // 2. Check notification permission
    results.permission = Notification.permission;

    // 3. Check service worker
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        results.serviceWorker = !!registration;
      } catch (e) {
        results.serviceWorker = false;
      }
    } else {
      results.serviceWorker = false;
    }

    // 4. Check push subscription exists locally
    try {
      const subscription = await getCurrentSubscription();
      results.pushSubscription = !!subscription;
    } catch (e) {
      results.pushSubscription = false;
    }

    // 5. Check VAPID key
    results.vapidKey = !!import.meta.env.VITE_VAPID_PUBLIC_KEY;

    // 6. Check user authentication
    if (isSupabaseConfigured()) {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
      results.userId = currentUser?.id || null;

      if (currentUser?.id) {
        // 7. Check if subscription exists in database
        const { data: dbSub, error: subError } = await supabase
          .from('push_subscriptions')
          .select('*')
          .eq('user_id', currentUser.id)
          .limit(1)
          .single();

        if (dbSub && !subError) {
          results.subscriptionInDB = true;
          setDbSubscription(dbSub);
        } else {
          results.subscriptionInDB = false;
        }

        // 8. Check pending notifications
        const { data: notifs, error: notifError } = await supabase
          .from('scheduled_notifications')
          .select('*')
          .eq('user_id', currentUser.id)
          .eq('status', 'pending')
          .order('scheduled_for', { ascending: true })
          .limit(10);

        if (notifs && !notifError) {
          results.pendingNotifications = notifs.length;
          setPendingNotifs(notifs);
        } else {
          results.pendingNotifications = 0;
        }
      }
    }

    setChecks(results);
    setLoading(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const StatusIcon = ({ status }) => {
    if (status === true || status === 'granted') {
      return <CheckCircle className="text-green-500" size={20} />;
    }
    if (status === false || status === 'denied') {
      return <XCircle className="text-red-500" size={20} />;
    }
    if (status === 'default' || status === null) {
      return <AlertTriangle className="text-yellow-500" size={20} />;
    }
    return <CheckCircle className="text-green-500" size={20} />;
  };

  const testPushFromServer = async () => {
    if (!user?.id) {
      alert('You must be logged in to test');
      return;
    }

    try {
      // Create a test notification scheduled for 1 minute from now
      const scheduledFor = new Date(Date.now() + 60 * 1000).toISOString();
      
      const { error } = await supabase
        .from('scheduled_notifications')
        .insert({
          user_id: user.id,
          title: '🧪 Test Push Notification',
          body: 'If you see this (even with app closed), push is working!',
          scheduled_for: scheduledFor,
          status: 'pending',
        });

      if (error) throw error;
      
      alert(`Test notification scheduled for ${new Date(scheduledFor).toLocaleTimeString()}.\n\nClose the app and wait 1-2 minutes to see if it arrives!`);
      runDiagnostics();
    } catch (error) {
      alert('Error scheduling test: ' + error.message);
    }
  };

  return (
    <div className="p-4 bg-white rounded-2xl border-4 border-blue-400 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-display text-blue-600 flex items-center gap-2">
          <Bell size={24} />
          Push Notification Diagnostic
        </h2>
        <button
          onClick={runDiagnostics}
          disabled={loading}
          className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Checklist */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2">
          <StatusIcon status={checks.browserSupport} />
          <span className="font-crayon">Browser supports push: {checks.browserSupport ? 'Yes' : 'No'}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <StatusIcon status={checks.permission} />
          <span className="font-crayon">Notification permission: {checks.permission || 'Unknown'}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <StatusIcon status={checks.serviceWorker} />
          <span className="font-crayon">Service worker ready: {checks.serviceWorker ? 'Yes' : 'No'}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <StatusIcon status={checks.vapidKey} />
          <span className="font-crayon">VAPID key configured: {checks.vapidKey ? 'Yes' : 'No'}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <StatusIcon status={checks.pushSubscription} />
          <span className="font-crayon">Local push subscription: {checks.pushSubscription ? 'Yes' : 'No'}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <StatusIcon status={!!checks.userId} />
          <span className="font-crayon">User logged in: {checks.userId ? 'Yes' : 'No'}</span>
        </div>

        {checks.userId && (
          <>
            <div className="flex items-center gap-2">
              <StatusIcon status={checks.subscriptionInDB} />
              <span className="font-crayon">
                Subscription in database: {checks.subscriptionInDB ? 'Yes' : 'NO - THIS IS THE PROBLEM!'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <StatusIcon status={checks.pendingNotifications > 0} />
              <span className="font-crayon">
                Pending notifications: {checks.pendingNotifications}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Problem Detection */}
      {!checks.subscriptionInDB && checks.userId && (
        <div className="p-3 bg-red-100 border-2 border-red-300 rounded-xl mb-4">
          <p className="font-crayon text-red-700 text-sm">
            <strong>⚠️ Problem Found:</strong> Your push subscription is NOT saved to the database!
            This means the server can't send you notifications.
          </p>
          <p className="font-crayon text-red-600 text-xs mt-1">
            Try: Go to Settings → Toggle notifications OFF then ON again.
          </p>
        </div>
      )}

      {checks.subscriptionInDB && checks.pendingNotifications === 0 && (
        <div className="p-3 bg-yellow-100 border-2 border-yellow-300 rounded-xl mb-4">
          <p className="font-crayon text-yellow-700 text-sm">
            <strong>ℹ️ Info:</strong> Subscription is saved, but no notifications are scheduled.
            Create a schedule with a future time to test.
          </p>
        </div>
      )}

      {/* Database Subscription Details */}
      {dbSubscription && (
        <div className="p-3 bg-gray-50 rounded-xl mb-4 text-xs font-mono">
          <p><strong>Device:</strong> {dbSubscription.device_name}</p>
          <p><strong>Created:</strong> {new Date(dbSubscription.created_at).toLocaleString()}</p>
          <p><strong>Last Used:</strong> {dbSubscription.last_used_at ? new Date(dbSubscription.last_used_at).toLocaleString() : 'Never'}</p>
          <p><strong>Endpoint:</strong> {dbSubscription.endpoint?.slice(0, 50)}...</p>
        </div>
      )}

      {/* Pending Notifications */}
      {pendingNotifs.length > 0 && (
        <div className="mb-4">
          <p className="font-crayon text-sm text-gray-600 mb-2">Pending Notifications:</p>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {pendingNotifs.map(n => (
              <div key={n.id} className="text-xs p-2 bg-blue-50 rounded">
                <strong>{n.title}</strong> - {new Date(n.scheduled_for).toLocaleString()}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Test Button */}
      <button
        onClick={testPushFromServer}
        disabled={!checks.subscriptionInDB}
        className={`w-full py-3 rounded-xl font-display text-white 
          ${checks.subscriptionInDB 
            ? 'bg-green-500 hover:bg-green-600' 
            : 'bg-gray-300 cursor-not-allowed'
          }`}
      >
        🧪 Schedule Test Push (1 min)
      </button>
      <p className="text-xs text-gray-500 text-center mt-2">
        Schedule a test notification, then CLOSE the app to verify it arrives
      </p>
    </div>
  );
};

export default PushNotificationDiagnostic;
