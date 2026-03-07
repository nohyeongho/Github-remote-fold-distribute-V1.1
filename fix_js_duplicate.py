import sys

def fix_file():
    filepath = 'lockring-search.html'
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find where the true State block starts
    state_marker = "    // ── State ────────────────────────────────────────────────────"
    excel_marker = "    // ── Excel Data ───────────────────────────────────────────────"
    
    # We want to keep only ONE excel data block.
    # The file currently looks like:
    # excel_marker... state_marker ... excel_marker ... state_marker
    
    # Let's just find the first excel_marker, and the last state_marker,
    # and reconstruct the middle. Or even better, replace ALL occurrences of excelData and state with just one.
    
    parts = content.split(excel_marker)
    if len(parts) > 1:
        # parts[0] is everything before the first excel_marker.
        # The last part will contain the actual state code minus the marker if we split by state_marker.
        
        # safely find the last state_marker in the file
        last_state_idx = content.rfind(state_marker)
        if last_state_idx != -1:
            before_first_excel = parts[0]
            after_last_state = content[last_state_idx:]
            
            # The excel data block to inject:
            excel_data_code = """    // ── Excel Data ───────────────────────────────────────────────
    const excelData = {
      "1": { "whereToUse": "Drier Inlet(1Eva, 2Eva) / Drier Outlet(2Eva)", "partNumber": "MGZ63048101 ", "connectorName": "LR 4 NK Ms 00", "pipeMm": "4", "pipeInch": "‘5/32" },
      "2": { "whereToUse": "Condenser connection(4.76) ", "partNumber": "MGZ63047101 ", "connectorName": "LR 5 NK Ms 00", "pipeMm": "4.76", "pipeInch": "‘3/16" },
      "3": { "whereToUse": "Condenser(4.76) + Hot Line(4.0) ", "partNumber": "MGZ63047801 ", "connectorName": "LR 5/4 NR Ms 00", "pipeMm": "4.76 / 4", "pipeInch": "‘3/16 : 5/32" },
      "4": { "whereToUse": "Condenser connection(4.76) ", "partNumber": "MGZ63047101 ", "connectorName": "LR 5 NK Ms 00", "pipeMm": "4.76", "pipeInch": "‘3/16" },
      "5": { "whereToUse": "Comp high side pipe ", "partNumber": "MGZ63047901 ", "connectorName": "LR 7/5 NR Ms 00", "pipeMm": "7 / 4.76", "pipeInch": "      - : ‘3/16" },
      "6": { "whereToUse": "8.0 Pipe connection ", "partNumber": "MGZ63047501 ", "connectorName": "LR 8 NK Ms 00", "pipeMm": "8", "pipeInch": "‘5/16" },
      "7": { "whereToUse": "L shape Lokring : Comp process pipe", "partNumber": "MGZ65560901", "connectorName": "8 NWK Ms SVC 00", "pipeMm": "6.35 / -", "pipeInch": "‘1/4" },
      "8": { "whereToUse": "T Charging(Comp+S/Pipe)", "partNumber": "MGZ63447001 ", "connectorName": "6 NK MS SV 00", "pipeMm": "6.35", "pipeInch": " ‘1/4" },
      "9": { "whereToUse": "6.35 Pipe connection ", "partNumber": "MGZ63047201 ", "connectorName": "LR 6 NK Ms 00", "pipeMm": "6.35", "pipeInch": "‘1/4" },
      "10": { "whereToUse": "8.0 Evaporator - Capi (AL)", "partNumber": "MGZ63447202 ", "connectorName": "8/2 NR Al 00", "pipeMm": "46236", "pipeInch": "‘5/16  : 5/64" },
      "11": { "whereToUse": "6.35 Evaporator pipe connection (AL)", "partNumber": "MGZ63047202 ", "connectorName": "LR 6.35 NK Al 00", "pipeMm": "6.35", "pipeInch": " ‘1/4" },
      "12": { "whereToUse": "8.0 Evaporator pipe connection (AL)", "partNumber": "MGZ63047502 ", "connectorName": "LR 8 NK Al 00", "pipeMm": "8", "pipeInch": "‘5/16" },
      "13": { "whereToUse": "Evaporator Pipe - Evaporator Pipe(OD 8.5)", "partNumber": "MGZ63847301", "connectorName": "8.5 NK Al 00", "pipeMm": "8.5/8.5", "pipeInch": "- : -" },
      "14": { "whereToUse": "Drier – Capi tube", "partNumber": "MGZ63048201 ", "connectorName": "LR 4/2 NR Ms 00", "pipeMm": "46114", "pipeInch": "‘5/32 : 5/64" },
      "15": { "whereToUse": "6.35 Evaporator pipe connection (AL)", "partNumber": "MGZ63047202 ", "connectorName": "LR 6.35 NK Al 00", "pipeMm": "6.35", "pipeInch": " ‘1/4" },
      "17": { "whereToUse": "3.5 3way – 2.0 Capi", "partNumber": "MGZ65528101", "connectorName": "3.5/2 NR Ms 00", "pipeMm": "3.5/2", "pipeInch": "" },
      "18": { "whereToUse": "Drier - Drier (SCD)", "partNumber": "MGZ63847101", "connectorName": "3.5 NK MS 00", "pipeMm": "3.5/3.5", "pipeInch": "- : -" },
      "19": { "whereToUse": "4.0 Drier – 3.5 3way", "partNumber": "MGZ63847202", "connectorName": "4/3.5 NR Ms 00", "pipeMm": "4/3.5", "pipeInch": "" }
    };

"""
            
            new_content = before_first_excel + excel_data_code + after_last_state
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print("Fixed duplicate excelData successfully.")
        else:
            print("Could not find stat marker.")
    else:
        print("Could not find excel marker.")

fix_file()
