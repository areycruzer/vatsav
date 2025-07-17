# Vatsav: Revolutionising India's Emergency Response

**Vatsav** is an **AI-powered emergency dispatch system** designed to **optimise India's 112 emergency response system**. It addresses critical challenges within the **112 Emergency Response Support System (ERSS)**, aiming to improve public safety and well-being for the citizens of India.

## The Problems Vatsav Solves

Vatsav is developed for a dual target audience: **direct operational users** (emergency dispatchers and operators) and **ultimate beneficiaries** (the Indian people/citizens).

### For Direct Operational Users (Emergency Dispatchers and Operators):
*   **Overwhelming Call Volume**: Dispatchers are inundated with a massive influx of **non-emergency, prank, and blank calls**. For instance, in Delhi, approximately **10,000 out of 15,672 daily calls are blank**, leading to dispatcher stress, cognitive overload, potential errors, and dangerous delays in responding to real emergencies.
*   **Repetitive Workflows and Manual Coordination**: Operators often struggle with repeated low-priority calls and slow manual coordination, which can lead to burnout.
*   **Language Barriers**: India's significant linguistic diversity poses a challenge for human operators to communicate effectively with all callers, with regional language coverage varying.
*   **Difficulty in Information Extraction and Decision Making**: Manually assessing call severity, urgency, and resource needs is slow and prone to error.
*   **Lack of Empathy and Emotional Support Tools**: Distressed callers in traumatic situations may not consistently receive empathetic emotional support.
*   **Need for Real-Time Oversight**: Dispatchers require real-time oversight of resources to efficiently dispatch services.

### For Ultimate Beneficiaries (The Indian People/Citizens):
*   **Long Wait Times and Slow Response**: The current 112 system in India faces challenges with **average response times ranging from 12 to 24 minutes**, with reports of delays and public dissatisfaction. An ambulance was reported to be stuck for five hours in Nainital due to traffic congestion.
*   **Lack of Accessibility due to Language Barriers**: India's vast linguistic diversity, with over 22 scheduled languages and numerous dialects, can hinder effective communication.
*   **Inconsistent Emotional Support During Emergencies**: Callers experiencing traumatic events may not receive empathetic handling consistently.
*   **Delays due to Traffic and Poor Infrastructure**: Traffic congestion and poor infrastructure cause significant delays for emergency vehicles.
*   **Risk of Missed or Delayed Critical Responses**: With a high volume of non-emergency and blank calls, genuine emergencies may be delayed or missed, impacting positive outcomes for citizens in distress.
*   **Fragmented System**: Despite the 112 initiative, the emergency response system remains fragmented, with varying protocols and contact numbers leading to inefficiencies and confusion.
*   **Gaps in Pre-hospital Emergency Services**: This includes insufficient ambulance availability, shortages of well-trained Emergency Medical Technicians (EMTs), and underdeveloped technology integration.

## Vatsav's Solution & Key Features

Vatsav proposes an **AI-driven solution** to address these problems, leveraging advanced technologies to enhance efficiency and empathy in emergency call handling.

### Core AI Capabilities:
*   **Real-Time Emergency Filtering**: The AI automatically filters out blank and non-emergency calls, allowing dispatchers to focus on genuine emergencies. Vatsav targets **97–99% accuracy** in detecting such calls, optimised for Indian dialects and languages.
*   **AI-Powered Triage**: Evaluates call severity, urgency, and resource needs, providing **action recommendations** (e.g., dispatch police, ambulance, fire). It aims for a **triage latency of under 2 seconds**.
*   **Language Translation & Multilingual Support**: Offers features like Hindi ↔ Tamil ↔ Telugu ↔ English ↔ Bengali translation, enhancing accessibility for callers from diverse linguistic backgrounds.
*   **Emotion Detection & Empathetic AI Responses**: Utilises Sentiment AI (e.g., Hume EVI, NVIDIA Riva) to analyse caller tone, allowing the AI to provide empathetic responses, calm callers, and maintain clear communication.
*   **Auto-Documentation**: Converts audio into call logs and incident reports, freeing up dispatchers' time.

### Integration and Operational Enhancements:
*   **Smart Routing Dashboard & Real-Time Incident Dashboard**: Displays live emergencies and unit statuses, supporting faster and more informed dispatching decisions and enhancing dispatch efficiency.
*   **GPS Tracking & Automated Emergency Corridors**: Incorporates GPS tracking for emergency vehicles and integrates AI with traffic systems to clear routes, ensuring faster arrival of first responders.
*   **Integration with ERSS Systems**: Designed to integrate with 112 India backend APIs, GPS services, and radio communication channels.

### Human-in-the-Loop Principle:
*   Vatsav operates on a **human-in-the-loop** principle, meaning the AI supports and assists human dispatchers with information and recommendations, but it **never replaces their final decisions**, ensuring human control and accountability in critical emergency situations.

## Anticipated Impact
By implementing Vatsav, the project aims to **significantly enhance India's emergency response capabilities**. This includes:
*   **Reducing dispatcher workload and fatigue**.
*   **Speeding up critical response dispatch** and improving overall response times. Vatsav aims for dispatch within **15 minutes in urban areas and 30 minutes in rural areas**.
*   **Improving caller experience with empathy and trust**.
*   Critically, **saving thousands of lives annually**, with the economic value of lives saved potentially reaching **Rs 5,000 crore yearly**.
*   It also has the potential to save up to **Rs 96 crore annually in operational costs** by reducing the need for human operators.

## Running the Project Locally

To run the Vatsav dashboard locally, you need to start three separate servers in three different terminal windows.

### Prerequisites

- Node.js
- A separate clone of the `hume` repository (from `https://github.com/areycruzer/hume`) in the same parent directory as the `vatsav` project.
- You must have a `.env.local` file in the `hume` project directory with the necessary Hume AI API keys.

### 1. Start the Vatsav Backend Server

This server handles the database connection and the main API.

```bash
# In the /vatsav directory
cd /path/to/project/vatsav
node server/index.js
```
This will start the backend on `http://localhost:3001`.

### 2. Start the Hume EVI Server

This server runs the voice call interface that is embedded in the dashboard.

```bash
# In the /hume directory
cd /path/to/project/hume
npm run dev -- -p 3003
```
This will start the Hume EVI server on `http://localhost:3003`.

### 3. Start the Vatsav Frontend Server

This server runs the main dashboard user interface.

```bash
# In the /vatsav directory
cd /path/to/project/vatsav
npm run dev
```
This will start the frontend on `http://localhost:8080` (or the next available port). You can then access the dashboard at this URL.
