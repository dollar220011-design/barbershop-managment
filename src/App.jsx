${worker.revenue.toFixed(2)}
                      </strong>

                      <div>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={worker.rate}
                          onChange={(e) =>
                            updateRate(
                              index,
                              e.target.value
                            )
                          }
                          style={{
                            width: '70px',
                            padding: '7px',
                            borderRadius: '8px',
                            border: '1px solid #555',
                            background: 'transparent',
                            color: 'inherit',
                            textAlign: 'center',
                          }}
                        />

                        <span>%</span>
                      </div>

                      <strong>
                        ${workerShare.toFixed(2)}
                      </strong>

                      <strong>
                        ${shopShare.toFixed(2)}
                      </strong>

                    </div>
                  );
                })}

              </div>

            </section>

          </section>
        )}

        {/* Other pages */}
        {activePage !== 'لوحة التحكم' &&
          activePage !== 'العمال' && (
            <section className="content">

              <div className="welcome-row">

                <div>
                  <h2>{activePage}</h2>

                  <p>
                    هذه الصفحة موجودة في النظام، وسنربط وظائفها
                    بالتفصيل في الخطوات القادمة.
                  </p>
                </div>

              </div>

            </section>
          )}

      </main>
    </div>
  );
}
