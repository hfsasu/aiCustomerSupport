import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { auth } from '@clerk/nextjs';

export async function GET() {
  try {
    // Get the current user
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Fetch orders for the current user
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        items:order_items(
          *,
          menuItem:menu_items(*)
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Error fetching orders' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { cartItems, total } = await req.json();
    
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty or invalid' }, { status: 400 });
    }
    
    // Create order
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          user_id: userId,
          total,
          status: "pending",
        },
      ])
      .select()
      .single();
    
    if (orderError) throw orderError;
    
    // Create order items
    const orderItems = cartItems.map((item: any) => ({
      order_id: orderData.id,
      menu_item_id: item.menu_item_id,
      quantity: item.quantity,
      price: item.menuItem.price,
      special_instructions: item.special_instructions || '',
    }));
    
    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);
    
    if (itemsError) throw itemsError;
    
    // Fetch the complete order with items
    const { data: completeOrder, error: fetchError } = await supabase
      .from("orders")
      .select(`
        *,
        items:order_items(
          *,
          menuItem:menu_items(*)
        )
      `)
      .eq("id", orderData.id)
      .single();
    
    if (fetchError) throw fetchError;
    
    return NextResponse.json(completeOrder);
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
  }
} 