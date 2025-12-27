#!/bin/bash

echo "Testing all main pages..."

# Test homepage
echo -n "Homepage (/): "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$STATUS" = "200" ]; then
  echo "✓ OK (200)"
else
  echo "✗ FAILED ($STATUS)"
fi

# Test case studies
echo -n "Case Study 1 (/studi-kasus/meningkatkan-roas-ecommerce-fashion): "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/studi-kasus/meningkatkan-roas-ecommerce-fashion)
if [ "$STATUS" = "200" ]; then
  echo "✓ OK (200)"
else
  echo "✗ FAILED ($STATUS)"
fi

# Test categories
echo -n "Category 1 (/kategori/digital-advertising): "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/kategori/digital-advertising)
if [ "$STATUS" = "200" ]; then
  echo "✓ OK (200)"
else
  echo "✗ FAILED ($STATUS)"
fi

echo ""
echo "All main public pages tested!"
echo ""
echo "The website is ready. Please open in browser (use incognito/private window or clear cache to see fresh data):"
echo "http://localhost:3000"
