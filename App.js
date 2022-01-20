import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const Section = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      {children}
    </View>
  );
};

const Goaffpro = require('react-native-goaffpro');

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            paddingBottom: 32,
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Setup">
            <Text style={{marginTop: 8}}>
              Import the Goaffpro SDK in your application
            </Text>
            <View
              style={{
                backgroundColor: '#eee',
                marginTop: 16,
                marginBottom: 16,
                padding: 16,
              }}>
              <Text>{"import Goaffpro from 'react-native-sdk'"}</Text>
            </View>
          </Section>
          <InitializeSDKComponent />
          <SetupReferralCode />
          <TrackPageView />
          <TrackConversion />
          <Section title="Learn More">
            <Text>Read the docs to discover what to do next:</Text>
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

function TrackConversion() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(false);
  const [number, setNumber] = useState('#1001');
  const [total, setTotal] = useState('100');
  function trackConversion() {
    setLoading(true);
    Goaffpro.trackConversion({
      number,
      total,
    })
      .then(res => {
        console.log('response', res);
        setResponse(res);
        setLoading(false);
      })
      .catch(() => {
        console.log('error');
        setResponse({
          error: 'Unexpected error',
        });
        setLoading(false);
      });
  }

  return (
    <Section title="Step Four (optional)">
      <Text style={{marginTop: 8, marginBottom: 8}}>
        Click the button below to track a dummy order. You should see the sale
        getting recorded in your admin panel
      </Text>
      <TextInput
        autoCapitalize={'none'}
        placeholder="Order number"
        autoCorrect={false}
        value={number}
        onChangeText={setNumber}
        style={styles.input}
      />
      <TextInput
        keyboardType={'decimal-pad'}
        placeholder="Order total"
        autoCorrect={false}
        value={total}
        onChangeText={setTotal}
        style={styles.input}
      />
      <View
        style={{
          backgroundColor: '#eee',
          marginTop: 16,
          marginBottom: 16,
          padding: 16,
        }}>
        <Text>{`Goaffpro.trackConversion(${JSON.stringify(
          {number, total},
          null,
          2,
        )})`}</Text>
      </View>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button
          disabled={!number || !total}
          onPress={trackConversion}
          title="Track Conversion"
          accessibilityLabel="Learn more about this purple button"
        />
      )}
      {response ? (
        <View
          style={{
            backgroundColor: '#eee',
            marginTop: 16,
            marginBottom: 16,
            padding: 16,
          }}>
          <Text>{JSON.stringify(response, null, 2)}</Text>
        </View>
      ) : null}
    </Section>
  );
}

function TrackPageView() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(false);
  function trackPageView() {
    setLoading(true);
    Goaffpro.trackPageView()
      .then(res => {
        setResponse(res);
        setLoading(false);
      })
      .catch(e => {
        setResponse({error: 'Unexpected error'});
        setLoading(false);
      });
  }

  return (
    <Section title="Step Three (optional)">
      <Text style={{marginTop: 8, marginBottom: 8}}>
        Click the button below to track the page view. You should see a traffic
        entry in the analytics page in the app for this affiliate.
      </Text>
      <View
        style={{
          backgroundColor: '#eee',
          marginTop: 16,
          marginBottom: 16,
          padding: 16,
        }}>
        <Text>{'Goaffpro.trackPageView()'}</Text>
      </View>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button
          onPress={trackPageView}
          title="Track page view"
          accessibilityLabel="Learn more about this purple button"
        />
      )}
      {response ? (
        <View
          style={{
            backgroundColor: '#eee',
            marginTop: 16,
            marginBottom: 16,
            padding: 16,
          }}>
          <Text>{JSON.stringify(response, null, 2)}</Text>
        </View>
      ) : null}
    </Section>
  );
}

function SetupReferralCode() {
  const [referralCode, setReferralCode] = useState('');
  useEffect(() => {
    Goaffpro.getReferralCode().then(x => {
      if (x) {
        setReferralCode(x);
      }
    });
  }, []);

  return (
    <Section title="Step Two">
      <Text style={{marginTop: 8}}>
        Enter an affiliate's referral code. (for testing purposes). Normally,
        the sdk will record the referral code from the inbound link
      </Text>
      <TextInput
        autoCapitalize={'none'}
        placeholder="Referral Code"
        autoCorrect={false}
        value={referralCode}
        onChangeText={t => {
          setReferralCode(t);
          Goaffpro.setReferralCode(t);
        }}
        style={styles.input}
      />
      <View
        style={{
          backgroundColor: '#eee',
          marginTop: 16,
          marginBottom: 16,
          padding: 16,
        }}>
        <Text>{`Goaffpro.setReferralCode("${referralCode}")`}</Text>
      </View>
    </Section>
  );
}

function InitializeSDKComponent() {
  const [initialized, setInitialized] = useState(false);
  const [publicToken, setPublicToken] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (Goaffpro.getPublicToken()) {
      setInitialized(true);
      setPublicToken(Goaffpro.getPublicToken());
    }
  }, []);
  function initializeSDK() {
    setLoading(true);
    setInitialized(false);
    Goaffpro.init(publicToken).then(res => {
      setInitialized(true);
      setLoading(false);
    });
  }

  return (
    <Section title="Step One">
      <Text style={{marginTop: 8}}>
        Enter the public token to initialize the sdk
      </Text>
      <TextInput
        autoCapitalize={'none'}
        placeholder="x-goaffpro-public-token"
        autoCorrect={false}
        value={publicToken}
        onChangeText={t => {
          setInitialized(false);
          setPublicToken(t.toLowerCase());
        }}
        style={styles.input}
      />
      <View
        style={{
          backgroundColor: '#eee',
          marginTop: 16,
          marginBottom: 16,
          padding: 16,
        }}>
        <Text>{`Goaffpro.init("${publicToken}")`}</Text>
      </View>
      {loading ? (
        <ActivityIndicator />
      ) : initialized ? (
        <View style={{alignItems: 'center'}}>
          <Text style={{fontSize: 18, color: '#27ae60'}}>SDK initialized</Text>
        </View>
      ) : (
        <Button
          disabled={!publicToken}
          onPress={initializeSDK}
          title="Initialize SDK"
          accessibilityLabel="Learn more about this purple button"
        />
      )}
    </Section>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    marginTop: 12,
    borderWidth: 1,
    padding: 10,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
