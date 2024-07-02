import React from "react";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  Chip,
} from "@mui/material";

const prefectures = [
  "北海道",
  "青森県",
  "岩手県",
  "宮城県",
  "秋田県",
  "山形県",
  "福島県",
  "茨城県",
  "栃木県",
  "群馬県",
  "埼玉県",
  "千葉県",
  "東京都",
  "神奈川県",
  "新潟県",
  "富山県",
  "石川県",
  "福井県",
  "山梨県",
  "長野県",
  "岐阜県",
  "静岡県",
  "愛知県",
  "三重県",
  "滋賀県",
  "京都府",
  "大阪府",
  "兵庫県",
  "奈良県",
  "和歌山県",
  "鳥取県",
  "島根県",
  "岡山県",
  "広島県",
  "山口県",
  "徳島県",
  "香川県",
  "愛媛県",
  "高知県",
  "福岡県",
  "佐賀県",
  "長崎県",
  "熊本県",
  "大分県",
  "宮崎県",
  "鹿児島県",
  "沖縄県",
];

const PrefectureSelector = ({ value, onChange }) => {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  const handleDeleteChip = (chipToDelete) => () => {
    onChange(value.filter((chip) => chip !== chipToDelete));
  };

  return (
    <FormControl sx={{ minWidth: 200 }}>
      <InputLabel>都道府県を選択</InputLabel>
      <Select
        multiple
        value={value}
        onChange={handleChange}
        renderValue={(selected) => (
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {selected.map((prefecture) => (
              <Chip
                key={prefecture}
                label={prefecture}
                style={{ margin: 2 }}
                onDelete={handleDeleteChip(prefecture)} // 削除ボタンを設定
              />
            ))}
          </div>
        )}
      >
        {prefectures.map((prefecture) => (
          <MenuItem key={prefecture} value={prefecture}>
            <Checkbox checked={value.indexOf(prefecture) > -1} />
            <ListItemText primary={prefecture} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default PrefectureSelector;
