import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select(`
        *,
        nutrition_info (
          calories,
          total_fat,
          saturated_fat,
          trans_fat,
          cholesterol,
          sodium,
          carbs,
          fiber,
          sugars,
          protein
        )
      `);

    if (error) throw error;

    const menuItems = data.map(item => ({
      ...item,
      nutrition: item.nutrition_info
    }));

    return NextResponse.json(menuItems);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error fetching menu items' }, { status: 500 });
  }
} 