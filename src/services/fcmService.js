import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

let isInitialized = false;

const initializedFirebase = () => {
    if (isInitialized || admin.apps.length > 0) return;

    try {
        const serviceAccountPath = path.resolve(process.cwd(), 'firebase-service-account.json');

        if (fs.existsSync(serviceAccountPath)) {
            const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                projectId: process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id
            });

            console.log('Firebase Admin SDK initialized successfully');
            isInitialized = true;
        } else {
            console.error('Firebase service account file not found!');
        }
    } catch (error) {
        console.error('Error initializing Firebase:', error);
    }
};

export const sendFCMToTopic = async ({ topic, title, body, data = {} }) => {
    try {
        initializedFirebase();

        if (!admin.apps.length) {
            throw new Error('Firebase not initialized');
        }

        const message = {
            notification: {
                title: title,
                body: body
            },
            data: {
                ...data,
                ...Object.fromEntries(
                    Object.entries(data).map(([key, value]) => [key, String(value)])
                )
            },
            topic: topic,
            android: {
                priority: 'high'
            },
            apns: {
                headers: {
                    'apns-priority': '10'
                }
            }
        };

        const response = await admin.messaging().send(message);
        console.log(`FCM sent successfully to topic ${topic}:`, response);
        return response;

    } catch (error) {
        console.error(`Error sending FCM to topic ${topic}:`, error);
        throw error;
    }
};