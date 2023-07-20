import { ref } from 'vue';
import { supabase } from '../lib/supabase';

const userSession = ref(null);

async function handleSignup({ email, password }, { name }) {
  const genericErrorMessage = 'Error signing up.';

  try {
    if (!email || !password) {
      const error = 'No email or password.';
      console.warn(error);
      return { success: false, error };
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { userName: name } },
    });

    if (error) {
      console.error(error, error.message);
      return { success: false, error: genericErrorMessage };
    }

    // TODO: change for Quasar dialog
    window.alert('Signup successful, confirmation mail should be sent soon!');

    // Success
    return { success: true };
  } catch (error) {
    console.error(genericErrorMessage, error);
    return { success: false, message: genericErrorMessage };
  }
}

async function handleLogin({ email, password }) {
  const genericErrorMessage = 'Error signing up.';

  try {
    if (!email || !password) {
      const error = 'No email or password.';
      console.warn(error);
      return { success: false, error };
    }

    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error(error);
      return { success: false, error: genericErrorMessage };
    }

    // TODO: check if this is needed:
    // No error throw, but no user detected so send magic link
    if (!error && !data) {
      window.alert('Check your email for the login link!');
    }

    // Success
    return { success: true };
  } catch (error) {
    console.error(genericErrorMessage, error);
    return { success: false, error: genericErrorMessage };
  }
}

async function handleLogout() {
  const genericErrorMessage = 'Error signing out.';

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(genericErrorMessage, error);
      return { success: false, message: genericErrorMessage };
    }

    // Success
    return { success: true };
  } catch (error) {
    console.error(genericErrorMessage, error);
    return { success: false, message: genericErrorMessage };
  }
}

async function handlePasswordReset({ email }) {
  const genericErrorMessage = 'Error resetting password.';

  try {
    if (!email) {
      const errorMessage = 'Email address is required.';
      // TODO: change for Quasar dialog
      window.alert(errorMessage);
      return { success: false, error: errorMessage };
    }

    const protocol = window.location.protocol;
    const host = window.location.host;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${protocol}//${host}/reset-password`,
    });

    if (error) {
      // TODO: change for Quasar dialog
      window.alert(genericErrorMessage + error.message);
      return { success: false, error: genericErrorMessage };
    }

    // Success
    // TODO: change for Quasar dialog
    window.alert('Password recovery email has been sent.');
    return { success: true };
  } catch (error) {
    console.error(genericErrorMessage, error);
    return { success: false, message: genericErrorMessage };
  }
}

async function handleUpdateUser({ password }) {
  const genericErrorMessage = 'Error updating user.';

  try {
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      // TODO: change for Quasar dialog
      window.alert(genericErrorMessage + error.message);
      return { success: false, error: genericErrorMessage };
    }

    // Success
    // TODO: change for Quasar dialog
    window.alert('Successfully updated user info!');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: genericErrorMessage };
  }
}

export {
  userSession,
  handleSignup,
  handleLogin,
  handleLogout,
  handlePasswordReset,
  handleUpdateUser,
};
