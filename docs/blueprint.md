# **App Name**: Sip & Snack

## Core Features:

- Order Form: Form for employees to submit tea and snack orders, including employee name (dropdown/text), tea (dropdown), snack (dropdown), amount (number, max ₹25), order date (auto-filled), and order time (auto-filled).
- Order Limit Validation: Validates that the order amount does not exceed the ₹25 limit.
- Order Window Restriction: Restricts order submission to a daily 30-minute window, displaying a message outside of this time.
- Order Submission & Notification: Submits the order details to a Google Sheet, and sends a free WhatsApp message to HR with the order information using a webhook.
- Admin Dashboard: Admin section with login to view all orders (daily, weekly, monthly), see total amounts, and manage employee names, tea, and snack lists.
- Report Page: Displays "Today's Order Summary" including current date/time, a list of Tea Items, and a list of Snacks Items.

## Style Guidelines:

- Primary color: Soft beige (#F5F5DC) to create a warm, inviting feel, referencing the comforting nature of tea and snacks.
- Background color: Very light beige (#FDFDF7), similar to the primary color but with minimal saturation, creating a clean backdrop.
- Accent color: Muted brown (#A67B5B), analogous to beige, adding contrast and highlighting important elements like buttons and links.
- Font pairing: 'PT Sans' (sans-serif) for body text, paired with 'Playfair' (serif) for headers, to balance readability with a touch of elegance.
- Clean, mobile-friendly layout with clear sections for order form, admin panel, and reports.
- Use simple, line-style icons representing tea and snack items for easy identification.
- Subtle animations for form submissions and data updates to provide feedback without being distracting.