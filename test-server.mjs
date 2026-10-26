import { spawn } from 'child_process';
import http from 'http';

function checkUrl(url, options = {}) {
  return new Promise((resolve) => {
    const parsed = new URL(url);
    const reqOptions = {
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + parsed.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    const req = http.request(reqOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body,
        });
      });
    });

    req.on('error', (err) => {
      resolve({ status: 0, error: err.message });
    });

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  console.log('--- STARTING NEXT.JS SERVER FOR AUDIT PROBING ---');
  const server = spawn('node', ['node_modules/next/dist/bin/next', 'start', '-p', '3000'], {
    cwd: process.cwd(),
    stdio: 'pipe',
    shell: true,
  });

  server.stdout.on('data', (d) => process.stdout.write(`[SERVER]: ${d}`));
  server.stderr.on('data', (d) => process.stderr.write(`[SERVER ERR]: ${d}`));

  let ready = false;
  for (let i = 0; i < 30; i++) {
    await sleep(1000);
    const check = await checkUrl('http://127.0.0.1:3000');
    if (check.status === 200) {
      ready = true;
      console.log('Server is UP and responding!');
      break;
    }
  }

  if (!ready) {
    console.error('Server failed to start in 30 seconds');
    server.kill();
    process.exit(1);
  }

  const results = [];

  // Helper to record
  async function test(name, fn) {
    try {
      const res = await fn();
      results.push({ name, pass: res.pass, details: res.details });
      console.log(`${res.pass ? '✅ [PASS]' : '❌ [FAIL]'} ${name}: ${res.details}`);
    } catch (e) {
      results.push({ name, pass: false, details: e.message });
      console.log(`❌ [FAIL] ${name}: ${e.message}`);
    }
  }

  // 1. Storefront Routes
  await test('Homepage GET /', async () => {
    const res = await checkUrl('http://127.0.0.1:3000/');
    return {
      pass: res.status === 200 && res.body.includes('ELITE'),
      details: `HTTP ${res.status}, body length: ${res.body.length}`,
    };
  });

  await test('Catalog GET /catalog', async () => {
    const res = await checkUrl('http://127.0.0.1:3000/catalog');
    return {
      pass: res.status === 200,
      details: `HTTP ${res.status}`,
    };
  });

  await test('Product Detail GET /product/chronographe-royal-or-noir', async () => {
    const res = await checkUrl('http://127.0.0.1:3000/product/chronographe-royal-or-noir');
    return {
      pass: res.status === 200 && res.body.includes('Royal Chrono'),
      details: `HTTP ${res.status}`,
    };
  });

  await test('Cart GET /cart', async () => {
    const res = await checkUrl('http://127.0.0.1:3000/cart');
    return {
      pass: res.status === 200,
      details: `HTTP ${res.status}`,
    };
  });

  await test('Checkout GET /checkout', async () => {
    const res = await checkUrl('http://127.0.0.1:3000/checkout');
    return {
      pass: res.status === 200,
      details: `HTTP ${res.status}`,
    };
  });

  await test('Track Order GET /track-order', async () => {
    const res = await checkUrl('http://127.0.0.1:3000/track-order');
    return {
      pass: res.status === 200,
      details: `HTTP ${res.status}`,
    };
  });

  await test('Policy Privacy GET /policies/privacy', async () => {
    const res = await checkUrl('http://127.0.0.1:3000/policies/privacy');
    return {
      pass: res.status === 200 && res.body.includes('09-08'),
      details: `HTTP ${res.status}`,
    };
  });

  await test('Policy Terms GET /policies/terms', async () => {
    const res = await checkUrl('http://127.0.0.1:3000/policies/terms');
    return {
      pass: res.status === 200,
      details: `HTTP ${res.status}`,
    };
  });

  await test('Policy Shipping GET /policies/shipping', async () => {
    const res = await checkUrl('http://127.0.0.1:3000/policies/shipping');
    return {
      pass: res.status === 200 && res.body.includes('Casablanca'),
      details: `HTTP ${res.status}`,
    };
  });

  await test('Policy Returns GET /policies/returns', async () => {
    const res = await checkUrl('http://127.0.0.1:3000/policies/returns');
    return {
      pass: res.status === 200,
      details: `HTTP ${res.status}`,
    };
  });

  await test('Policy Contact GET /policies/contact', async () => {
    const res = await checkUrl('http://127.0.0.1:3000/policies/contact');
    return {
      pass: res.status === 200,
      details: `HTTP ${res.status}`,
    };
  });

  // 2. Admin Authentication & Protection
  await test('Admin Login Page GET /admin/login', async () => {
    const res = await checkUrl('http://127.0.0.1:3000/admin/login');
    return {
      pass: res.status === 200,
      details: `HTTP ${res.status}`,
    };
  });

  await test('Admin Protected Page Unauthorized GET /admin (Expect 307 / 302 / 303 Redirect to login)', async () => {
    const res = await checkUrl('http://127.0.0.1:3000/admin');
    return {
      pass: [302, 303, 307, 308].includes(res.status),
      details: `HTTP ${res.status}, Location: ${res.headers.location}`,
    };
  });

  await test('Admin API Unauthorized GET /api/admin/orders (Expect 401 Unauthorized)', async () => {
    const res = await checkUrl('http://127.0.0.1:3000/api/admin/orders');
    return {
      pass: res.status === 401,
      details: `HTTP ${res.status}`,
    };
  });

  await test('Admin API Unauthorized GET /api/admin/inventory (Expect 401 Unauthorized)', async () => {
    const res = await checkUrl('http://127.0.0.1:3000/api/admin/inventory');
    return {
      pass: res.status === 401,
      details: `HTTP ${res.status}`,
    };
  });

  await test('Admin API Unauthorized GET /api/admin/analytics (Expect 401 Unauthorized)', async () => {
    const res = await checkUrl('http://127.0.0.1:3000/api/admin/analytics');
    return {
      pass: res.status === 401,
      details: `HTTP ${res.status}`,
    };
  });

  // 3. API Checkout & Order Lifecycle
  let createdOrderNumber = null;
  await test('Customer Checkout API POST /api/checkout (Valid submission)', async () => {
    const payload = {
      customer_name: 'Mehdi Chraibi',
      customer_phone: '0661998877',
      city: 'Rabat - Salé - Témara',
      address: 'Avenue Mohammed V, Appt 5',
      items: [
        {
          product_id: 'prod-01',
          variant_id: 'var-01-gold',
          quantity: 1,
        },
      ],
      coupon_code: 'WELCOME20',
    };

    const res = await checkUrl('http://127.0.0.1:3000/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const parsed = JSON.parse(res.body || '{}');
    if (parsed.success && parsed.orderNumber) {
      createdOrderNumber = parsed.orderNumber;
    }

    return {
      pass: res.status === 200 && parsed.success === true,
      details: `HTTP ${res.status}, Order: ${parsed.orderNumber}, Total: ${parsed.order?.total_payable_mad} DH`,
    };
  });

  await test('Customer Checkout API POST /api/checkout (Invalid phone rejection)', async () => {
    const payload = {
      customer_name: 'Test Bad Phone',
      customer_phone: '12345',
      city: 'Casablanca',
      address: 'Rue 1',
      items: [{ product_id: 'prod-01', variant_id: 'var-01-gold', quantity: 1 }],
    };

    const res = await checkUrl('http://127.0.0.1:3000/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    return {
      pass: res.status === 400,
      details: `HTTP ${res.status}, Error: ${JSON.parse(res.body || '{}').error}`,
    };
  });

  // 4. Order Confirmation Page Dynamic Rendering
  await test('Order Confirmation Page GET /order-confirmation/[orderNumber]', async () => {
    if (!createdOrderNumber) return { pass: false, details: 'No order created' };
    const res = await checkUrl(`http://127.0.0.1:3000/order-confirmation/${createdOrderNumber}`);
    return {
      pass: res.status === 200 && res.body.includes(createdOrderNumber),
      details: `HTTP ${res.status}, includes reference ${createdOrderNumber}`,
    };
  });

  // 5. Order Tracking API & Security Checks
  await test('Order Tracking API POST /api/orders/track (Authorized phone match)', async () => {
    if (!createdOrderNumber) return { pass: false, details: 'No order created' };
    const res = await checkUrl('http://127.0.0.1:3000/api/orders/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order_number: createdOrderNumber,
        phone: '0661998877',
      }),
    });

    const parsed = JSON.parse(res.body || '{}');
    return {
      pass: res.status === 200 && parsed.success === true,
      details: `HTTP ${res.status}, Status: ${parsed.order?.status}`,
    };
  });

  await test('Order Tracking API POST /api/orders/track (Unauthorized phone mismatch rejection)', async () => {
    if (!createdOrderNumber) return { pass: false, details: 'No order created' };
    const res = await checkUrl('http://127.0.0.1:3000/api/orders/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order_number: createdOrderNumber,
        phone: '0611111111',
      }),
    });

    return {
      pass: res.status === 404,
      details: `HTTP ${res.status} (Forbidden customer data exposure avoided)`,
    };
  });

  // 6. Admin Authentication & Protected Session
  let adminCookie = '';
  await test('Admin Login POST /api/admin/auth/login (Correct credentials)', async () => {
    const res = await checkUrl('http://127.0.0.1:3000/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin',
        password: 'EliteWatche2026!',
      }),
    });

    const rawCookie = res.headers['set-cookie'];
    if (rawCookie) {
      adminCookie = Array.isArray(rawCookie) ? rawCookie[0].split(';')[0] : rawCookie.split(';')[0];
    }

    return {
      pass: res.status === 200 && adminCookie.includes('elite_admin_session'),
      details: `HTTP ${res.status}, Cookie: ${adminCookie ? 'Issued' : 'Missing'}`,
    };
  });

  await test('Admin API Authorized GET /api/admin/orders with session cookie', async () => {
    const res = await checkUrl('http://127.0.0.1:3000/api/admin/orders', {
      headers: { Cookie: adminCookie },
    });
    const parsed = JSON.parse(res.body || '{}');
    return {
      pass: res.status === 200 && Array.isArray(parsed.orders),
      details: `HTTP ${res.status}, Orders count: ${parsed.orders?.length}`,
    };
  });

  await test('Admin API Authorized GET /api/admin/analytics with session cookie', async () => {
    const res = await checkUrl('http://127.0.0.1:3000/api/admin/analytics', {
      headers: { Cookie: adminCookie },
    });
    const parsed = JSON.parse(res.body || '{}');
    return {
      pass: res.status === 200 && parsed.analytics?.confirmedRevenueMAD !== undefined,
      details: `HTTP ${res.status}, Confirmed revenue: ${parsed.analytics?.confirmedRevenueMAD} DH, Net profit: ${parsed.analytics?.netProfitMAD} DH`,
    };
  });

  console.log('\n========================================');
  console.log(`SUMMARY: ${results.filter((r) => r.pass).length}/${results.length} TESTS PASSED`);
  console.log('========================================');

  server.kill();
  process.exit(results.every((r) => r.pass) ? 0 : 1);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
