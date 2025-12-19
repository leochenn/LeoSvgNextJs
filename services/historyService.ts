
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

export const saveHistory = async (content: string): Promise<void> => {
    if (!content.trim()) return;

    try {
        const { error } = await supabase
            .from('input_history')
            .insert([{ content: content.trim() }])
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
