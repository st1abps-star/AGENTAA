@@ .. @@
           </div>
           
           <div className="flex items-center gap-3">
-            <div className="glass-panel rounded-xl px-4 py-2 flex items-center gap-3">
-              <Settings className="h-4 w-4 text-slate-400" />
-              <span className="text-xs text-slate-400 font-medium">Temperature</span>
-              <input
-                type="range"
-                min={0}
-                max={1}
-                step={0.1}
-                value={temperature}
-                onChange={(e) => setTemperature(parseFloat(e.target.value))}
-                className="w-16 accent-neon"
-              />
-              <span className="text-xs text-slate-300 font-mono w-8 text-right">
-                {temperature.toFixed(1)}
-              </span>
-            </div>
             <LiquidButton 
               variant="secondary" 
               size="sm"
               onClick={clearChat}
               icon={<Trash2 className="h-4 w-4" />}
-            </h1>
-          </div>
             >
               Clear
             </LiquidButton>
           </div>
         </header>