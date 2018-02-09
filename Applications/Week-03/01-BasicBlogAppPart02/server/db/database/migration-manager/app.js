const pgp = require('pg-promise')();
const migrationFolder = '/home/node/app/migrations/';
const fs = require('fs');

const cn = {
    host: process.env.POSTGRES_HOST || 'localhost', // 'localhost' is the default;
    port: process.env.POSTGRES_PORT || 5432, // 5432 is the default;
    database: process.env.POSTGRES_DB || 'postgres',
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || ''
};

console.log(cn);
const db = pgp(cn);

console.log('Running Migrations...');
migrations();

function migrations() {
    // get migrations from table
    let query = `SELECT * FROM migrations ORDER BY id ASC`;
    db.any(query)
        .then(dbMigrations => {
            console.log(dbMigrations);
            // get migration files from /migrations folder
            fs.readdir(migrationFolder, (err, files) => {
                let filePromises = [];
                if (err) {
                    console.log(err);
                } else {
                    files = files.sort();
                    console.log(files);

                    files.forEach((file) => {
                        let found = false;
                        for (let mi = 0; mi < dbMigrations.length; mi++) {
                            if (file === dbMigrations[mi].migration_name) {
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            filePromises.push(runMigration(dbMigrations, file));
                        }
                    });

                    if (filePromises.length === 0) {
                        console.log('=========== No New Migrations ================');
                    } else {

                        Promise.all(filePromises)
                            .then((data) => {
                                console.log(data);
                                console.log('=========== Migrations Finished =============');
                            })
                            .catch(e => {
                                console.log(e);
                                console.log('=========== Migrations FAILED =============');
                            });
                    }
                }
            });

        })
        .catch(e => {
            return console.log(`Error getting migrations.`, e);
        });

}

function runMigration(dbMigrations, file) {
    return new Promise((resolve, reject) => {

        try {
            var sql = fs.readFileSync(`${migrationFolder}${file}`, 'utf8');
            console.log(`Running Migration ${file}`);
            console.log(sql);

            db.any(sql)
                .then(response => {
                    console.log(response);
                    // add sql to
                    let query2 = `INSERT INTO migrations (migration_name) VALUES ($1)`;
                    console.log(query2);
                    db.any(query2, [file])
                        .then(response => {
                            console.log(response);
                            resolve(`${file} migration complete..`)
                        })
                        .catch(e => {
                            console.log(`${file} migration FAILED..`);
                            console.log(e);
                            reject(e);
                        });
                })
                .catch(e => {
                    console.log(`${file} migration FAILED..`);
                    console.log(e);
                    reject(e);
                });
        } catch (e) {
            console.log(`${file} migration FAILED..`);
            console.log(e);
            reject(e);
        }

    });
}