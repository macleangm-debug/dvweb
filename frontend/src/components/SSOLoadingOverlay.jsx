/**
 * SSO Loading Overlay - Provides smooth transitions during SSO authentication
 * Shows branded loading states for seamless user experience
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ClipboardList, Activity, BarChart3, Shield, ArrowRight, Check } from 'lucide-react';

// Product configurations
const PRODUCTS = {
  fieldforce: {
    name: 'FieldForce',
    icon: MapPin,
    gradient: 'from-teal-400 to-emerald-500',
    spinnerColor: 'border-t-teal-400',
    bgGradient: 'from-teal-500/10 via-transparent to-emerald-500/10'
  },
  survey360: {
    name: 'Survey360',
    icon: ClipboardList,
    gradient: 'from-cyan-400 to-teal-500',
    spinnerColor: 'border-t-cyan-400',
    bgGradient: 'from-cyan-500/10 via-transparent to-teal-500/10'
  },
  datapulse: {
    name: 'DataPulse',
    icon: Activity,
    gradient: 'from-indigo-500 to-purple-600',
    spinnerColor: 'border-t-indigo-400',
    bgGradient: 'from-indigo-500/10 via-transparent to-purple-500/10'
  },
  dataviz: {
    name: 'DataViz Studio',
    icon: BarChart3,
    gradient: 'from-violet-500 to-purple-600',
    spinnerColor: 'border-t-violet-400',
    bgGradient: 'from-violet-500/10 via-transparent to-purple-500/10'
  }
};

// Loading stages for the animation
const STAGES = {
  REDIRECT_TO_SSO: 'redirect_to_sso',
  AUTHENTICATING: 'authenticating',
  EXCHANGING_TOKEN: 'exchanging_token',
  ENTERING_APP: 'entering_app',
  COMPLETE: 'complete',
  LOGGING_OUT: 'logging_out',
  LOGOUT_COMPLETE: 'logout_complete'
};

const SSOLoadingOverlay = ({ 
  product = 'fieldforce', 
  stage = STAGES.REDIRECT_TO_SSO,
  isVisible = true 
}) => {
  const productConfig = PRODUCTS[product] || PRODUCTS.fieldforce;
  const ProductIcon = productConfig.icon;

  const getStageContent = () => {
    switch (stage) {
      case STAGES.REDIRECT_TO_SSO:
        return {
          title: 'Connecting to DataVision',
          subtitle: 'Redirecting to secure login...',
          progress: 25
        };
      case STAGES.AUTHENTICATING:
        return {
          title: 'Authenticating',
          subtitle: 'Verifying your credentials...',
          progress: 50
        };
      case STAGES.EXCHANGING_TOKEN:
        return {
          title: 'Setting Up Access',
          subtitle: `Preparing ${productConfig.name}...`,
          progress: 75
        };
      case STAGES.ENTERING_APP:
        return {
          title: `Welcome to ${productConfig.name}`,
          subtitle: 'Loading your dashboard...',
          progress: 90
        };
      case STAGES.COMPLETE:
        return {
          title: 'Ready!',
          subtitle: 'Launching application...',
          progress: 100
        };
      default:
        return {
          title: 'Loading',
          subtitle: 'Please wait...',
          progress: 0
        };
    }
  };

  const stageContent = getStageContent();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center"
        >
          {/* Animated background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${productConfig.bgGradient} opacity-50`} />
          
          {/* Animated circles */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className={`absolute w-[600px] h-[600px] rounded-full bg-gradient-to-br ${productConfig.gradient} blur-3xl`}
          />

          {/* Main content */}
          <div className="relative z-10 text-center px-6">
            {/* Logo section */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              {/* DataVision + Product logos */}
              <div className="flex items-center justify-center gap-4 mb-6">
                {/* DataVision logo */}
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="bg-white rounded-xl p-3 shadow-2xl"
                >
                  <img 
                    src="/datavision-logo-cropped.png" 
                    alt="DataVision" 
                    className="h-8 w-auto"
                  />
                </motion.div>

                {/* Connection arrow */}
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="flex items-center gap-1"
                >
                  <div className="w-8 h-[2px] bg-gradient-to-r from-white/50 to-white/20 rounded-full" />
                  <ArrowRight className="w-5 h-5 text-white/50" />
                  <div className="w-8 h-[2px] bg-gradient-to-r from-white/20 to-white/50 rounded-full" />
                </motion.div>

                {/* Product logo */}
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className={`w-14 h-14 bg-gradient-to-br ${productConfig.gradient} rounded-xl flex items-center justify-center shadow-2xl`}
                >
                  <ProductIcon className="w-7 h-7 text-white" />
                </motion.div>
              </div>

              {/* Product name */}
              <motion.h2
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-white"
              >
                {productConfig.name}
              </motion.h2>
            </motion.div>

            {/* Loading card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 max-w-md mx-auto"
            >
              {/* SSO Badge */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 text-sm font-medium">DataVision SSO</span>
              </div>

              {/* Spinner */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  {/* Outer ring */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className={`w-16 h-16 border-4 border-white/10 ${productConfig.spinnerColor} rounded-full`}
                  />
                  {/* Inner pulse */}
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className={`absolute inset-2 bg-gradient-to-br ${productConfig.gradient} rounded-full opacity-20`}
                  />
                  {/* Check icon when complete */}
                  {stage === STAGES.COMPLETE && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Check className="w-8 h-8 text-emerald-400" />
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Stage text */}
              <motion.div
                key={stage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-semibold text-white mb-2">
                  {stageContent.title}
                </h3>
                <p className="text-white/60 text-sm">
                  {stageContent.subtitle}
                </p>
              </motion.div>

              {/* Progress bar */}
              <div className="mt-6">
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stageContent.progress}%` }}
                    transition={{ duration: 0.5 }}
                    className={`h-full bg-gradient-to-r ${productConfig.gradient} rounded-full`}
                  />
                </div>
              </div>
            </motion.div>

            {/* Security note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-white/40 text-xs"
            >
              Secure single sign-on powered by DataVision International
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Export stages for use in other components
export { STAGES };
export default SSOLoadingOverlay;
