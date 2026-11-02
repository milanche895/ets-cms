"use client";

import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { normalizeForSearch } from "@/lib/transliterate";
import type { SearchEntry } from "@/types/content";

type SearchDialogProps = {
  open: boolean;
  onClose: () => void;
  entries: SearchEntry[];
};

export function SearchDialog({ open, onClose, entries }: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const normalized = normalizeForSearch(query.trim());
    if (!normalized) {
      return entries.slice(0, 6);
    }

    return entries
      .filter((entry) => normalizeForSearch(`${entry.title} ${entry.group}`).includes(normalized))
      .slice(0, 8);
  }, [entries, query]);

  function openResult(href: string) {
    setQuery("");
    onClose();
    router.push(href);
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="pretraga-naslov"
    >
      <DialogContent sx={{ pt: 2.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography id="pretraga-naslov" variant="h3" component="h2" sx={{ fontSize: "1.25rem" }}>
            Претрага
          </Typography>
          <IconButton aria-label="Затвори претрагу" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <TextField
          autoFocus
          fullWidth
          label="Унесите појам"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />
        <List sx={{ mt: 1 }}>
          {results.length === 0 ? (
            <Typography color="text.secondary" sx={{ px: 1, py: 2 }}>
              Нема резултата.
            </Typography>
          ) : (
            results.map((entry) => (
              <ListItemButton key={entry.id} onClick={() => openResult(entry.href)}>
                <ListItemText primary={entry.title} secondary={entry.group} />
              </ListItemButton>
            ))
          )}
        </List>
      </DialogContent>
    </Dialog>
  );
}
