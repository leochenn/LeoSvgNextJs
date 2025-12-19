
import { supabase } from './supabaseClient';

export interface HistoryItem {
    id: string;
    content: string;
    created_at: string;
}

export const fetchHistory = async (): Promise<string[]> => {
    try {
        const { data, error } = await supabase
            .from('input_history')
            .select('content')
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) {
            console.error('Error fetching history:', error);
            return [];
        }

        return data.map((item) => item.content);
    } catch (err) {
        console.error('Unexpected error fetching history:', err);
        return [];
    }
};

export const saveHistory = async (content: string, userId: string): Promise<void> => {
    if (!content.trim() || !userId) return;

    try {
        const { error } = await supabase
            .from('input_history')
            .insert([{
                content: content.trim(),
                user_id: userId
            }])
            .select(); // Using select to return data, helpful for debugging if needed

        // Check for duplicate key error (code 23505) which we expect and ignore
        if (error) {
            if (error.code !== '23505') {
                console.error('Error saving history:', error);
            }
        }
    } catch (err) {
        console.error('Unexpected error saving history:', err);
    }
};

export const deleteHistoryItem = async (content: string, userId: string): Promise<void> => {
    try {
        const { error } = await supabase
            .from('input_history')
            .delete()
            .match({ content, user_id: userId });

        if (error) {
            console.error('Error deleting history item:', error);
        }
    } catch (err) {
        console.error('Unexpected error deleting history item:', err);
    }
};
