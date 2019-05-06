package com.cs492.moodio;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.lufinkey.react.spotify.RNSpotifyPackage;
import com.lufinkey.react.eventemitter.RNEventEmitterPackage;
import com.psykar.cookiemanager.CookieManagerPackage;
import com.rnfs.RNFSPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import org.reactnative.camera.RNCameraPackage;
import com.rnim.rn.audio.ReactNativeAudioPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNFetchBlobPackage(),
            new RNSpotifyPackage(),
            new RNEventEmitterPackage(),
            new CookieManagerPackage(),
            new RNFSPackage(),
            new VectorIconsPackage(),
            new RNSoundPackage(),
            new RNGestureHandlerPackage(),
            new RNCameraPackage(),
            new ReactNativeAudioPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
