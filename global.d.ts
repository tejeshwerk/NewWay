declare namespace JSX {
  interface Element {}
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare module 'react' {
  export function useState<T>(initial: T): [T, (v: T) => void];
  export function useEffect(effect: any, deps?: any[]): void;
  const React: any;
  export default React;
}
declare module 'react-native' {
  export const Text: any;
  export const View: any;
  export const FlatList: any;
  export const ActivityIndicator: any;
  export const SafeAreaView: any;
  export const useColorScheme: any;
  export const StyleSheet: any;
  export const TouchableOpacity: any;
  export interface TextProps {
    [key: string]: any;
  }
}
declare module '@expo/vector-icons/MaterialCommunityIcons' {
  const MaterialCommunityIcons: any;
  export default MaterialCommunityIcons;
}
declare module 'expo-router';
declare module 'react-native-safe-area-context';
declare module '@google-cloud/firestore' {
  export class Firestore {
    constructor(options?: any);
    collection(path: string): any;
  }
  export interface DocumentSnapshot {
    data(): any;
  }
}
declare namespace FirebaseFirestore {
  interface DocumentSnapshot {
    data(): any;
  }
}
declare module '@google-cloud/storage' {
  export class Storage {
    constructor(options?: any);
    bucket(name: string): any;
  }
}
declare module 'firebase-functions' {
  export interface EventContext {
    params: any;
  }
}
declare module 'firebase-functions/v2/firestore';
declare module 'axios' {
  const axios: any;
  export default axios;
}
declare module 'cheerio' {
  export function load(html: string): any;
}
declare module 'openai' {
  class OpenAI {
    constructor(options?: any);
    chat: any;
  }
  export default OpenAI;
}
declare module 'node-fetch' {
  const fetch: any;
  export default fetch;
}
declare module 'express' {
  export interface Request {}
  export interface Response {
    status(code: number): Response;
    json(data: any): Response;
    send(data?: any): Response;
  }
}

declare var process: any;
declare var Buffer: any;
declare module 'expo-av' {
  export const Video: any;
}
declare module 'firebase/app'
declare module 'firebase/firestore' {
  export interface DocumentData { [key: string]: any }
  export const getFirestore: any;
  export const collection: any;
  export const query: any;
  export const orderBy: any;
  export const onSnapshot: any;
  export const limit: any;
}
