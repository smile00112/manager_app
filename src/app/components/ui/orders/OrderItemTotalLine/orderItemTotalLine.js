import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React from "react";

export function TotalLine({title, total}) {


    return (
        <div>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={1}
            >
                <Typography variant="subtitle2" component="div">
                    {title}
                </Typography>
                <Typography component="div">
                    {total}₽
                </Typography>
            </Stack>
        </div>
    );
}