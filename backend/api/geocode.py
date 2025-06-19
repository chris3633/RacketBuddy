from http.server import BaseHTTPRequestHandler
import json
import urllib.parse
import requests

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.end_headers()

    def do_GET(self):
        parsed_path = urllib.parse.urlparse(self.path)
        query_params = urllib.parse.parse_qs(parsed_path.query)
        query = query_params.get('query', [''])[0]

        if not query:
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps([]).encode())
            return

        # Call LocationIQ API
        response = requests.get(
            'https://us1.locationiq.com/v1/autocomplete',
            params={
                'key': 'pk.a77154f1765f87458c4552e06abea27d',
                'q': query,
                'format': 'json',
                'limit': 10,
                'addressdetails': 1,
                'dedupe': 1,
                'extratags': 1,
                'namedetails': 1,
                'layer': 'poi,address,venue',
                'countrycodes': 'us',
                'bounded': 1,
                'normalizeaddress': 0
            },
            headers={'Accept': 'application/json'},
            timeout=5
        )

        if response.status_code == 200:
            results = response.json()
            formatted_results = []
            for result in results:
                display_name = result.get('display_name', '')
                lat = result.get('lat', '')
                lon = result.get('lon', '')
                formatted_results.append({
                    'display_name': display_name,
                    'lat': lat,
                    'lon': lon
                })
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(formatted_results).encode())
        else:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps([]).encode()) 