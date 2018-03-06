
FROM mongo:latest
COPY billing.json /home/data/
COPY users.json /home/data/
RUN ['mongoimport', '--db', 'billing', '--collection', 'invoices', '--file', '/home/data/billing.json']
RUN ['mongoimport', '--db', 'users', '--collection', 'collection', '--file', '/home/data/users.json']



