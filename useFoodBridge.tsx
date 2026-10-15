import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  UserRole,
  FoodListing,
  NGO,
  Volunteer,
  PickupRecord,
  NotificationItem,
  PickupStatus,
  DietaryType,
} from '../types';
import {
  DEMO_USERS,
  INITIAL_LISTINGS,
  INITIAL_NGOS,
  INITIAL_VOLUNTEERS,
  INITIAL_PICKUPS,
  INITIAL_NOTIFICATIONS,
} from '../data/initialData';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

export interface DemoStepInfo {
  step: number;
  totalSteps: number;
  title: string;
  description: string;
  activeRole: UserRole;
  targetView: string;
}

export const DEMO_SCENARIO_STEPS: DemoStepInfo[] = [
  {
    step: 1,
    totalSteps: 7,
    title: 'Provider logs preparation',
    description: 'ABC College prepares 500 dinner servings for hostel students.',
    activeRole: 'provider',
    targetView: 'ai-predictor',
  },
  {
    step: 2,
    totalSteps: 7,
    title: 'AI Predicts 79 surplus meals',
    description: 'Neural demand engine forecasts 421 meals needed & flags 79 surplus risk.',
    activeRole: 'provider',
    targetView: 'ai-predictor',
  },
  {
    step: 3,
    totalSteps: 7,
    title: 'Surplus published & auto-matched',
    description: 'System identifies Hope Community Kitchen with 95% dietary & distance match.',
    activeRole: 'provider',
    targetView: 'food-surplus',
  },
  {
    step: 4,
    totalSteps: 7,
    title: 'NGO accepts donation',
    description: 'Ananya from Hope Kitchen claims the batch to serve 79 people tonight.',
    activeRole: 'ngo',
    targetView: 'overview',
  },
  {
    step: 5,
    totalSteps: 7,
    title: 'Volunteer Arjun assigned',
    description: 'Electric cargo vehicle courier accepts rapid pickup task.',
    activeRole: 'volunteer',
    targetView: 'volunteer',
  },
  {
    step: 6,
    totalSteps: 7,
    title: 'Live route in transit & delivered',
    description: 'Food transport verified hot (>60°C) and handed over successfully.',
    activeRole: 'volunteer',
    targetView: 'pickups',
  },
  {
    step: 7,
    totalSteps: 7,
    title: 'Impact ledger updated (+79 meals)',
    description: 'Carbon emissions mitigated and 25 kg waste prevented!',
    activeRole: 'admin',
    targetView: 'impact',
  },
];

interface FoodBridgeContextType {
  currentUser: User;
  currentRole: UserRole;
  currentView: string;
  setCurrentView: (view: string) => void;
  switchRole: (role: UserRole) => void;
  listings: FoodListing[];
  ngos: NGO[];
  volunteers: Volunteer[];
  pickups: PickupRecord[];
  notifications: NotificationItem[];
  unreadCount: number;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  toasts: ToastMessage[];
  addToast: (title: string, message?: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;

  // Actions
  createListing: (listing: Omit<FoodListing, 'id' | 'createdAt'>) => FoodListing;
  updateListing: (id: string, updates: Partial<FoodListing>) => void;
  deleteListing: (id: string) => void;
  acceptDonation: (listingId: string, ngoId: string) => PickupRecord | null;
  assignVolunteerToPickup: (pickupId: string, volunteerId: string) => void;
  advancePickupStatus: (pickupId: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetDemoData: () => void;

  // Celebration modal
  completedDeliveryModal: PickupRecord | null;
  closeDeliveryModal: () => void;

  // Demo scenario
  demoStep: number;
  isDemoRunning: boolean;
  nextDemoStep: () => void;
  prevDemoStep: () => void;
  startAutoDemo: () => void;
  stopAutoDemo: () => void;
  resetDemoScenario: () => void;
}

const FoodBridgeContext = createContext<FoodBridgeContextType | null>(null);

const STORAGE_KEYS = {
  USER: 'fb_current_user',
  VIEW: 'fb_current_view',
  LISTINGS: 'fb_listings_v2',
  NGOS: 'fb_ngos_v2',
  VOLUNTEERS: 'fb_volunteers_v2',
  PICKUPS: 'fb_pickups_v2',
  NOTIFICATIONS: 'fb_notifications_v2',
  DARK_MODE: 'fb_dark_mode',
};

export const FoodBridgeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state
  const [darkMode, setDarkModeState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const setDarkMode = (dark: boolean) => {
    setDarkModeState(dark);
    try {
      localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(dark));
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Current view & User
  const [currentView, setCurrentViewState] = useState<string>(() => {
    return 'landing';
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return DEMO_USERS.provider;
  });

  const setCurrentView = (view: string) => {
    setCurrentViewState(view);
    try {
      localStorage.setItem(STORAGE_KEYS.VIEW, view);
    } catch (e) {
      console.warn(e);
    }
  };

  const switchRole = useCallback((role: UserRole) => {
    const targetUser = DEMO_USERS[role] || DEMO_USERS.provider;
    setCurrentUser(targetUser);
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(targetUser));
    } catch (e) {
      console.warn(e);
    }
    // Context-sensitive landing or overview view
    if (currentView === 'landing' || currentView === 'auth') {
      setCurrentView('overview');
    }
  }, [currentView]);

  // Listings
  const [listings, setListings] = useState<FoodListing[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LISTINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_LISTINGS;
  });

  // NGOs
  const [ngos, setNgos] = useState<NGO[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NGOS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_NGOS;
  });

  // Volunteers
  const [volunteers, setVolunteers] = useState<Volunteer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VOLUNTEERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_VOLUNTEERS;
  });

  // Pickups
  const [pickups, setPickups] = useState<PickupRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PICKUPS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_PICKUPS;
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = useCallback((title: string, message?: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));
    } catch (e) {
      console.warn(e);
    }
  }, [listings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PICKUPS, JSON.stringify(pickups));
    } catch (e) {
      console.warn(e);
    }
  }, [pickups]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {
      console.warn(e);
    }
  }, [notifications]);

  // Delivery celebration modal
  const [completedDeliveryModal, setCompletedDeliveryModal] = useState<PickupRecord | null>(null);

  const closeDeliveryModal = () => {
    setCompletedDeliveryModal(null);
  };

  const triggerCelebrationConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4855fe', '#070e6a', '#ff5a00', '#22C55E', '#f5c400'],
      });
    } catch (e) {
      console.warn('Confetti note:', e);
    }
  };

  // Actions
  const createListing = useCallback(
    (newListingData: Omit<FoodListing, 'id' | 'createdAt'>): FoodListing => {
      const id = `FL-${1000 + listings.length + 1}`;
      const newListing: FoodListing = {
        ...newListingData,
        id,
        createdAt: new Date().toISOString(),
      };

      setListings((prev) => [newListing, ...prev]);

      // Add Notification
      const newNotif: NotificationItem = {
        id: `notif_${Date.now()}`,
        title: `New Surplus Published: ${newListing.title}`,
        message: `${newListing.quantityMeals} meals ready at ${newListing.providerName}. AI scanning nearby receivers.`,
        type: 'urgent',
        timestamp: 'Just now',
        read: false,
        targetView: 'food-surplus',
      };
      setNotifications((prev) => [newNotif, ...prev]);

      addToast(
        'Surplus Published! 🎉',
        `${newListing.quantityMeals} meals available. Smart matching initiated.`,
        'success'
      );
      return newListing;
    },
    [listings.length, addToast]
  );

  const updateListing = useCallback((id: string, updates: Partial<FoodListing>) => {
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  }, []);

  const deleteListing = useCallback((id: string) => {
    setListings((prev) => prev.filter((item) => item.id !== id));
    addToast('Listing Removed', 'The surplus entry has been archived.', 'info');
  }, [addToast]);

  const acceptDonation = useCallback(
    (listingId: string, ngoId: string): PickupRecord | null => {
      const listing = listings.find((l) => l.id === listingId);
      if (!listing) return null;

      const foundNgo = ngos.find((n) => n.id === ngoId);
      const targetNgoId = foundNgo ? foundNgo.id : DEMO_USERS.ngo.id;
      const targetNgoName = foundNgo ? foundNgo.name : DEMO_USERS.ngo.organization || DEMO_USERS.ngo.name;
      const targetNgoAddress = foundNgo ? foundNgo.address : DEMO_USERS.ngo.location || '14 Civil Lines, Block B';
      const targetNgoCoords = foundNgo ? foundNgo.coordinates : { x: 32, y: 42 };

      // Update listing state
      updateListing(listingId, {
        status: 'accepted',
        acceptedByNgoId: targetNgoId,
        acceptedByNgoName: targetNgoName,
      });

      // Assign nearest volunteer
      const defaultVolunteer = volunteers[0] || INITIAL_VOLUNTEERS[0];

      // Create new Pickup record
      const pickupId = `FB-${2050 + pickups.length}`;
      const newPickup: PickupRecord = {
        id: pickupId,
        listingId: listing.id,
        foodTitle: listing.title,
        quantityMeals: listing.quantityMeals,
        weightKg: listing.weightKg,
        providerName: listing.providerName,
        providerAddress: listing.providerAddress,
        ngoName: targetNgoName,
        ngoAddress: targetNgoAddress,
        volunteerName: defaultVolunteer.name,
        volunteerPhone: defaultVolunteer.phone,
        status: 'assigned',
        etaMinutes: 18,
        distanceKm: listing.distanceKm || 3.2,
        createdAt: new Date().toISOString(),
        assignedAt: new Date().toISOString(),
        routeProgressPercent: 20,
        providerCoords: listing.coordinates,
        ngoCoords: targetNgoCoords,
        courierCoords: {
          x: Math.round((listing.coordinates.x + 32) / 2),
          y: Math.round((listing.coordinates.y + 42) / 2),
        },
      };

      setPickups((prev) => [newPickup, ...prev]);

      // Notification
      const notif: NotificationItem = {
        id: `notif_${Date.now()}`,
        title: `Donation Accepted by ${newPickup.ngoName}`,
        message: `${newPickup.quantityMeals} meals matched. Volunteer ${defaultVolunteer.name} assigned.`,
        type: 'accepted',
        timestamp: 'Just now',
        read: false,
        targetView: 'pickups',
      };
      setNotifications((prev) => [notif, ...prev]);

      addToast(
        'Donation Accepted! 🍱',
        `${targetNgoName} has claimed the batch. Courier notified.`,
        'success'
      );

      return newPickup;
    },
    [listings, ngos, volunteers, pickups.length, updateListing, addToast]
  );

  const assignVolunteerToPickup = useCallback(
    (pickupId: string, volunteerId: string) => {
      const vol = volunteers.find((v) => v.id === volunteerId);
      if (!vol) return;

      setPickups((prev) =>
        prev.map((p) =>
          p.id === pickupId
            ? {
                ...p,
                volunteerName: vol.name,
                volunteerPhone: vol.phone,
                status: 'assigned',
                assignedAt: new Date().toISOString(),
              }
            : p
        )
      );
      addToast('Volunteer Assigned', `${vol.name} assigned to ${pickupId}.`, 'info');
    },
    [volunteers, addToast]
  );

  const advancePickupStatus = useCallback(
    (pickupId: string) => {
      const pickup = pickups.find((p) => p.id === pickupId);
      if (!pickup) return;

      let nextStatus: PickupStatus = pickup.status;
      let progress = pickup.routeProgressPercent;
      let eta = pickup.etaMinutes;

      if (pickup.status === 'accepted') {
        nextStatus = 'assigned';
        progress = 25;
        eta = 20;
      } else if (pickup.status === 'assigned') {
        nextStatus = 'in_transit';
        progress = 60;
        eta = 10;
      } else if (pickup.status === 'in_transit') {
        nextStatus = 'delivered';
        progress = 100;
        eta = 0;
      }

      setPickups((prev) =>
        prev.map((p) => {
          if (p.id === pickupId) {
            const updated = {
              ...p,
              status: nextStatus,
              routeProgressPercent: progress,
              etaMinutes: eta,
              deliveredAt: nextStatus === 'delivered' ? new Date().toISOString() : p.deliveredAt,
            };
            if (nextStatus === 'delivered') {
              setCompletedDeliveryModal(updated);
              triggerCelebrationConfetti();
            }
            return updated;
          }
          return p;
        })
      );

      // If delivered, update associated listing to completed
      if (nextStatus === 'delivered') {
        updateListing(pickup.listingId, { status: 'completed' });
        addToast(
          'Food Rescued Successfully! 🎉',
          `${pickup.quantityMeals} meals safely delivered to ${pickup.ngoName}.`,
          'success'
        );
      } else {
        addToast(
          'Status Updated',
          `Pickup ${pickupId} marked as ${nextStatus.replace('_', ' ')}.`,
          'info'
        );
      }
    },
    [pickups, updateListing, addToast]
  );

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('All Caught Up', 'All notifications marked as read.', 'info');
  }, [addToast]);

  const resetDemoData = useCallback(() => {
    setListings(INITIAL_LISTINGS);
    setNgos(INITIAL_NGOS);
    setVolunteers(INITIAL_VOLUNTEERS);
    setPickups(INITIAL_PICKUPS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentUser(DEMO_USERS.provider);
    setCurrentView('overview');
    try {
      localStorage.removeItem(STORAGE_KEYS.LISTINGS);
      localStorage.removeItem(STORAGE_KEYS.PICKUPS);
      localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEMO_USERS.provider));
    } catch (e) {
      console.warn(e);
    }
    addToast('Demo State Reset', 'Default simulation dataset reloaded.', 'info');
  }, [addToast]);

  // Demo Scenario State & Stepper
  const [demoStep, setDemoStep] = useState<number>(1);
  const [isDemoRunning, setIsDemoRunning] = useState<boolean>(false);

  const executeStepActions = useCallback(
    (stepNum: number) => {
      const stepInfo = DEMO_SCENARIO_STEPS.find((s) => s.step === stepNum);
      if (!stepInfo) return;

      switchRole(stepInfo.activeRole);
      setCurrentView(stepInfo.targetView);

      if (stepNum === 3) {
        // Ensure a top matchable surplus listing is highlighted
        const target = listings.find((l) => l.id === 'FL-1001');
        if (target) {
          updateListing(target.id, { status: 'urgent' });
        }
      } else if (stepNum === 4) {
        // NGO accepts
        const target = listings.find((l) => l.id === 'FL-1001');
        if (target && target.status !== 'accepted') {
          acceptDonation(target.id, 'ngo_hope');
        }
      } else if (stepNum === 6) {
        // Move pickup FB-2045 to in_transit or FB-2048 to delivered
        const activePickup = pickups.find((p) => p.status === 'in_transit') || pickups[0];
        if (activePickup && activePickup.status !== 'delivered') {
          advancePickupStatus(activePickup.id);
        }
      } else if (stepNum === 7) {
        triggerCelebrationConfetti();
      }

      addToast(
        `Demo Step ${stepNum} of 7`,
        `${stepInfo.title}: ${stepInfo.description}`,
        'info'
      );
    },
    [switchRole, listings, updateListing, acceptDonation, pickups, advancePickupStatus, addToast]
  );

  const nextDemoStep = useCallback(() => {
    setDemoStep((prev) => {
      const next = prev < DEMO_SCENARIO_STEPS.length ? prev + 1 : 1;
      executeStepActions(next);
      return next;
    });
  }, [executeStepActions]);

  const prevDemoStep = useCallback(() => {
    setDemoStep((prev) => {
      const next = prev > 1 ? prev - 1 : DEMO_SCENARIO_STEPS.length;
      executeStepActions(next);
      return next;
    });
  }, [executeStepActions]);

  const startAutoDemo = useCallback(() => {
    setIsDemoRunning(true);
    executeStepActions(1);
    setDemoStep(1);
  }, [executeStepActions]);

  const stopAutoDemo = useCallback(() => {
    setIsDemoRunning(false);
  }, []);

  // Auto-play timer for demo mode
  useEffect(() => {
    if (!isDemoRunning) return;
    const timer = setInterval(() => {
      setDemoStep((prev) => {
        if (prev >= DEMO_SCENARIO_STEPS.length) {
          setIsDemoRunning(false);
          return prev;
        }
        const next = prev + 1;
        executeStepActions(next);
        return next;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [isDemoRunning, executeStepActions]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <FoodBridgeContext.Provider
      value={{
        currentUser,
        currentRole: currentUser.role,
        currentView,
        setCurrentView,
        switchRole,
        listings,
        ngos,
        volunteers,
        pickups,
        notifications,
        unreadCount,
        darkMode,
        setDarkMode,
        toasts,
        addToast,
        removeToast,
        createListing,
        updateListing,
        deleteListing,
        acceptDonation,
        assignVolunteerToPickup,
        advancePickupStatus,
        markNotificationRead,
        markAllNotificationsRead,
        resetDemoData,
        completedDeliveryModal,
        closeDeliveryModal,
        demoStep,
        isDemoRunning,
        nextDemoStep,
        prevDemoStep,
        startAutoDemo,
        stopAutoDemo,
        resetDemoScenario: () => {
          setDemoStep(1);
          setIsDemoRunning(false);
          resetDemoData();
        },
      }}
    >
      {children}
    </FoodBridgeContext.Provider>
  );
};

export const useFoodBridge = (): FoodBridgeContextType => {
  const context = useContext(FoodBridgeContext);
  if (!context) {
    throw new Error('useFoodBridge must be used within a FoodBridgeProvider');
  }
  return context;
};
