
FROM mongo
COPY billing.json /home/data/
COPY users.json /home/data/
CMD sleep 20 && mongoimport --host mongodb --db billing --collection invoices --file /home/data/billing.json && mongoimport --host mongodb --db users --collection collection --file /home/data/users.json



