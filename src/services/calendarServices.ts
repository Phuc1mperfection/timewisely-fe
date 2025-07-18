import apiClient from './apiClient';

// Types

// Types
export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
  location?: string;
  colorId?: string;
  calendarId?: string; // Thêm trường này cho backend trả về
  calendarName?: string; // Thêm trường này cho backend trả về
  creator?: {
    email: string;
    displayName?: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus?: 'needsAction' | 'declined' | 'tentative' | 'accepted';
  }>;
}

export interface CalendarList {
  items: Array<{
    id: string;
    summary: string;
    primary?: boolean;
    colorId?: string;
  }>;
}

// GET user's calendar list
export const getCalendars = async () => {
  try {
    console.log('Fetching calendar list...');
    
    // Use our backend endpoint instead of calling Google API directly
    // The backend will handle the authentication and API call to Google
    const res = await apiClient.get('/calendar/list', {
      // Add additional headers for debugging
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Calendar list raw response:', res.data);

    // Handle different response formats - the backend might return items directly or wrapped
    let calendarList: CalendarList;
    if (res.data && Array.isArray(res.data.items)) {
      // Standard format with items array
      calendarList = res.data as CalendarList;
    } else if (res.data && Array.isArray(res.data)) {
      // Array returned directly
      calendarList = { items: res.data };
    } else {
      // Empty or unexpected format
      console.warn('Unexpected calendar list format:', res.data);
      calendarList = { items: [] };
    }
    
    // Find primary calendar and store user email if found
    const primaryCalendar = calendarList.items.find(cal => cal.primary);
    if (primaryCalendar && primaryCalendar.id && primaryCalendar.id.includes('@')) {
      localStorage.setItem('userEmail', primaryCalendar.id);
      console.log('Stored user email from primary calendar:', primaryCalendar.id);
    }
    
    return calendarList;
  } catch (error) {
    console.error('Error fetching calendars:', error);
    // Return empty array as fallback to prevent UI errors
    return { items: [] };
  }
};

// GET events in calendar
export const getEvents = async (params?: { 
  timeMin?: string; 
  timeMax?: string;
  calendarId?: string;
}) => {
  try {
    // Use the user's email as default calendarId if none provided
    // This matches Google's behavior where calendar IDs are often the user's email
    const effectiveCalendarId = params?.calendarId || localStorage.getItem('userEmail') || 'primary';
    
    console.log('Fetching calendar events with params:', {
      ...params,
      calendarId: effectiveCalendarId
    });

  try {
    // Sử dụng endpoint mới: /calendar/calendars/{calendarId}/events
    // Endpoint này phù hợp với API của backend và đã được xác nhận hoạt động
    console.log('[Calendar] Attempting to fetch with calendars endpoint...');
    
    const encodedCalendarId = encodeURIComponent(effectiveCalendarId);
    const endpoint = `/calendar/calendars/${encodedCalendarId}/events`;
    console.log('[Calendar] Using endpoint:', endpoint);
    
    // Loại bỏ calendarId từ params vì đã nằm trong URL
    const requestParams = {
      maxResults: 100,
      timeMin: params?.timeMin,
      timeMax: params?.timeMax
    };
    
    const res = await apiClient.get(endpoint, { 
      params: requestParams,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('[Calendar] Success with apiClient:', res.data);
    return res.data;
  } catch (error: unknown) {
    // Type assertion to access error properties
    const clientError = error as {
      message?: string;
      response?: {
        status?: number;
        statusText?: string;
        data?: unknown;
      }
    };
    // Log detailed error information
    console.error('[Calendar] apiClient attempt failed:', {
      message: clientError.message,
      status: clientError.response?.status,
      statusText: clientError.response?.statusText,
      data: clientError.response?.data,
    });
      
      if (clientError.message === 'Network Error') {
        console.warn('[Calendar] Network error detected. This could be a CORS issue or the API server is not responding.');
        console.warn('[Calendar] Returning empty events to prevent UI errors');
        return { items: [] };
      }
      
      // We'll rethrow the error to be caught by the outer catch block
      throw clientError;
    }
  } catch (error) {
    console.error('[Calendar] All attempts to fetch events failed:', error);
    // Return properly formatted empty events array to prevent UI errors
    // This matches the format expected by CalendarView.tsx
    console.log('[Calendar] Returning empty events array with proper format');
    return { items: [] };
  }
};
export const syncCalendarEvents = async () => {
  try {
    // This endpoint doesn't exist in the backend, so we'll just fetch events instead
    console.log('Calendar sync requested, but no sync endpoint exists.');
    // We'll just return success and let the subsequent getEvents handle the actual data fetch
    return { success: true, message: 'Sync operation not needed - using direct fetch instead' };
  } catch (error) {
    console.error('Error syncing calendar events:', error);
    throw error;
  }
};
// CREATE event
export const createEvent = async (
  event: Partial<CalendarEvent>,
  calendarId: string = 'primary'
) => {
  try {
    console.log('Creating calendar event:', event);
    console.log('Target calendar ID:', calendarId);
    // Convert to the format the backend expects
    const eventDto = {
      summary: event.summary,
      description: event.description,
      location: event.location,
      colorId: event.colorId,
      startDateTime: event.start?.dateTime,
      endDateTime: event.end?.dateTime,
      isAllDay: false // Default to timed event
    };
    
    // Encode calendarId for URL path
    const encodedCalendarId = encodeURIComponent(calendarId);
    
    // Sử dụng endpoint đúng
    const endpoint = `/calendar/calendars/${encodedCalendarId}/events`;
    console.log('Using endpoint:', endpoint);
    
    // Use the backend API endpoint
    const res = await apiClient.post(endpoint, eventDto);
    console.log('Event created:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

// UPDATE event
export const updateEvent = async (
  eventId: string,
  event: Partial<CalendarEvent>,
  calendarId: string = 'primary'
) => {
  try {
    console.log(`Updating event ${eventId}:`, event);
    // Convert to the format the backend expects
    const eventDto = {
      summary: event.summary,
      description: event.description,
      location: event.location,
      colorId: event.colorId,
      startDateTime: event.start?.dateTime,
      endDateTime: event.end?.dateTime,
      isAllDay: false // Default to timed event
    };
    
    // Encode calendarId and eventId for URL path
    const encodedCalendarId = encodeURIComponent(calendarId);
    const encodedEventId = encodeURIComponent(eventId);
    
    // Sử dụng endpoint đúng
    const endpoint = `/calendar/calendars/${encodedCalendarId}/events/${encodedEventId}`;
    console.log('Using endpoint:', endpoint);
    
    // Use the backend API endpoint
    const res = await apiClient.put(endpoint, eventDto);
    console.log('Event updated:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

// DELETE event
export const deleteEvent = async (
  eventId: string,
  calendarId: string = 'primary'
) => {
  try {
    console.log(`Deleting event ${eventId} from calendar ${calendarId}`);
    
    // Encode calendarId and eventId for URL path
    const encodedCalendarId = encodeURIComponent(calendarId);
    const encodedEventId = encodeURIComponent(eventId);
    
    // Sử dụng endpoint đúng
    const endpoint = `/calendar/calendars/${encodedCalendarId}/events/${encodedEventId}`;
    console.log('Using endpoint:', endpoint);
    
    // Use the backend API endpoint
    await apiClient.delete(endpoint);
    console.log('Event deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};
export const connectGoogleCalendar = async () => {
  try {
    console.log("Initiating Google Calendar connection...");
    
    // Use the redirect URI that matches the backend configuration
    const redirectUri = `${window.location.origin}/dashboard/calendar`;
    
    // The OAuth endpoint should be on base URL not API URL
    // Because VITE_API_URL includes /api at the end
    const baseUrl = import.meta.env.VITE_URL || import.meta.env.VITE_API_URL.replace(/\/api$/, '');
    console.log("Base URL for OAuth:", baseUrl);
    
    // Use correct OAuth endpoint (without /api)
    const authUrl = new URL(`${baseUrl}/oauth2/authorize/google`);

    authUrl.searchParams.append("redirect_uri", redirectUri);

    // Add scopes for Calendar API access
    authUrl.searchParams.append(
      "scope",
      [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/calendar.events",
      ].join(" ")
    );

    console.log("Redirecting to OAuth consent screen:", authUrl.toString());
    
    // Redirect to Google OAuth consent screen
    window.location.href = authUrl.toString();
  } catch (error) {
    console.error("Error connecting Google Calendar:", error);
    throw error;
  }
};

// GET details for a specific calendar
export const getCalendarDetails = async (calendarId: string) => {
  try {
    // Make sure we have a valid calendarId - for Google this is often the user's email
    const effectiveCalendarId = calendarId || localStorage.getItem('userEmail') || 'primary';
    console.log(`Fetching details for calendar: ${effectiveCalendarId}`);
    
    // Make sure calendarId is properly encoded
    const encodedCalendarId = encodeURIComponent(effectiveCalendarId);
    console.log('Encoded calendarId:', encodedCalendarId);
    
    // Debug full URL
    const baseUrl = import.meta.env.VITE_API_URL || '';
    const fullUrl = `${baseUrl}/calendar/calendars/${encodedCalendarId}`;
    console.log('Full URL for calendar details:', fullUrl);
    
    // Use direct API call to ensure proper encoding
    const res = await apiClient.get(`/calendar/calendars/${encodedCalendarId}`);
    
    console.log('Received calendar details:', res.data);
    
    // Store the user's email if it's in the response and not already stored
    if (res.data && res.data.id && res.data.id.includes('@') && !localStorage.getItem('userEmail')) {
      localStorage.setItem('userEmail', res.data.id);
      console.log('Stored user email from calendar response:', res.data.id);
    }
    
    return res.data;
  } catch (error) {
    console.error('Error fetching calendar details:', error);
    return null;
  }
};

// GET all events from all calendars
export const getAllEvents = async (params?: { 
  timeMin?: string; 
  timeMax?: string;
  maxResults?: number;
}) => {
  try {
    console.log('Fetching all events from all calendars with params:', params);
    
    const requestParams = {
      maxResults: params?.maxResults || 100,
      timeMin: params?.timeMin,
      timeMax: params?.timeMax
    };
    
    // Sử dụng endpoint /calendar/all-events
    const res = await apiClient.get('/calendar/all-events', { 
      params: requestParams,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('[Calendar] Successfully fetched events from all calendars:', 
      res.data?.length ? `${res.data.length} events` : '0 events');
    
    return res.data || [];
  } catch (error: unknown) {
    // Type assertion to access error properties
    const clientError = error as {
      message?: string;
      response?: {
        status?: number;
        statusText?: string;
        data?: unknown;
      }
    };
    
    console.error('[Calendar] Failed to fetch all events:', {
      message: clientError.message,
      status: clientError.response?.status,
      statusText: clientError.response?.statusText,
      data: clientError.response?.data,
    });
    
    throw error;
  }
};
